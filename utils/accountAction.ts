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
    },
    fetchAccountById: async (account_id: string): Promise<Account> => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('account')
            .select('*')
            .eq('id', account_id);

        if (error) {
            throw new Error(error.message);
        }
        return data[0];
    },

    // New method to fetch an account by BSB and account number
    fetchAccountByBSBAndAccountNumber: async (bsb: string, accountNum: string): Promise<Account | null> => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('account')
            .select('*')
            .eq('bsb', bsb)
            .eq('acc', accountNum)  // Assuming your account table has these fields
            .single();  // Assuming only one account should match

        if (error) {
            console.error("Error fetching account by BSB and Account Number:", error);
            return null;  // Return null if there's an error or no account is found
        }
        return data || null;
    }

}
