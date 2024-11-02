import { createClient } from '@supabase/supabase-js';
import { createClient as supabaseClient } from '../supabase/client';
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

    listAllUsers: async (): Promise<{ id: string; last_sign_in_at: string | null }[]> => {
      const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SERVICE_ROLE_KEY!, {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        });
        
      // Fetch all users using the Supabase Admin API
      const { data: { users }, error } = await supabase.auth.admin.listUsers();
      
      if (error) {
          throw new Error(`Failed to list users: ${error.message}`);
      }

      // Map the users to include the required fields
      return users.map(user => ({
          id: user.id,
          last_sign_in_at: user.last_sign_in_at ?? null, // Metadata field to track last sign-in time
      }));
  },

  listMostRecentUsers: async (): Promise<{ id: string; last_sign_in_at: string | null }[]> => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SERVICE_ROLE_KEY!
    );

    let allUsers: { id: string; last_sign_in_at: string | null }[] = [];
    let page = 1;
    let limit = 50; // Maximum 50 users per page
    let hasMore = true;

    while (hasMore) {
      const { data: { users }, error } = await supabase.auth.admin.listUsers({ page, perPage: limit });

      if (error) {
        console.error("Error fetching users:", error);
        break;
      }

      if (!users || users.length === 0) {
        hasMore = false;
        break;
      }

      // Map and filter users with last_sign_in_at
      const mappedUsers = users.map((user) => ({
        id: user.id,
        last_sign_in_at: user.last_sign_in_at || null
      }));

      allUsers.push(...mappedUsers);
      page += 1;

      // If we received fewer users than the limit, assume we're done
      if (users.length < limit) {
        hasMore = false;
      }
    }

    // Sort by last_sign_in_at and get the 50 most recent
    const sortedUsers = allUsers
      .filter(user => user.last_sign_in_at !== null)
      .sort((a, b) => new Date(b.last_sign_in_at!).getTime() - new Date(a.last_sign_in_at!).getTime())
      .slice(0, 50);

    return sortedUsers;
  },

}
