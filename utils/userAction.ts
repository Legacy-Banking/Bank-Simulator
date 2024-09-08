import { createClient } from '@supabase/supabase-js';
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

}
