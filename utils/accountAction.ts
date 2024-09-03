import { createClient } from "./supabase/client";

export const accountAction = {
    fetchAccountsbyUserId: async (user_id: string): Promise<Account[]> => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('account')
            .select('*')
            .eq('owner', user_id);

        if (error) {
            throw new Error(error.message);
        }
        return data || [];
    }

}
