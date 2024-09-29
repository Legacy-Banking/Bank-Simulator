import { createClient } from '@supabase/supabase-js';
import { createClient as supabaseClient } from './supabase/client';
export const userAction = {
    //this should be admin only
    fetchAllUsers: async (): Promise<User[]> => {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SERVICE_ROLE_KEY!, {
            auth: {
              autoRefreshToken: false,
              persistSession: false
            }
          });
          const { data: { users }, error } = await supabase.auth.admin.listUsers();
          const aggregateUsers = users?.map((user) => {
            return {
              user_id: user.id,
            }as User;
          });

        
        return aggregateUsers || [];
    },
    fetchUserRole: async (user_id: string): Promise<string> => {
        const supabase = supabaseClient();
        const { data, error } = await supabase.from('admin_users').select('role').eq('id', user_id).single();
        return data?.role || 'default';
    },

    fetchUniqueOwners: async (): Promise<{ owner: string; owner_username: string }[]> => {
      const supabase = supabaseClient();
  
      // Query the 'amount' table and select distinct 'owner' and 'owner_username'
      const { data, error } = await supabase
        .from('account') // Replace with your actual table name if it's different
        .select('owner, owner_username');
  
      if (error) {
        console.error('Error fetching unique owners:', error);
        throw new Error(error.message);
      }
  
    // Create a Set to filter unique users
    const uniqueOwnersMap: { [key: string]: { owner: string; owner_username: string } } = {};

    data?.forEach((item) => {
      uniqueOwnersMap[item.owner] = item;
    });

    // Convert the map back to an array
    const uniqueOwners = Object.values(uniqueOwnersMap);

    return uniqueOwners;
    },

}
