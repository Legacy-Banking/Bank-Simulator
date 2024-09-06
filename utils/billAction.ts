import { createClient } from "./supabase/client";

export const billAction = {
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

}
