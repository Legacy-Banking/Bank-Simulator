import { createClient } from "./supabase/client";

export const billAction = {
    fetchBillsbyUserId: async (user_id: string): Promise<Bill[]> => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('bills')
            .select('*')
            .eq('billed_user', user_id);

        if (error) {
            throw new Error(error.message);
        }
        return data || [];
    },

    createBill:async (user_id:string, biller:Biller, amount:number, description:string):Promise<void>=>{
        const supabase = createClient();
        const newBill = {
            billed_user: user_id,
            from: biller.name,
            description: description,
            amount: amount,
            paid_on: new Date(),
            status: 'unpaid',
            created_on: new Date(),
            due_date: new Date()
        };
        supabase.from('bills').insert(newBill).then((data) => {
            console.log('Bill created:', data);
        });
    }


}
