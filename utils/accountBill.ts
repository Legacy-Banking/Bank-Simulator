import { createClient } from "./supabase/client";

export const accountBill = {
    fetchBillsbyUserId: async (user_id: string): Promise<Bill[]> => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('bills')
            .select('*')
            .eq('account', user_id);

        if (error) {
            throw new Error(error.message);
        }
        return data || [];
    },
    fetchBillsById: async (account_id: string): Promise<Bill> => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('bills')
            .select('*')
            .eq('id', account_id);

        if (error) {
            throw new Error(error.message);
        }
        return data[0];
    }

}
