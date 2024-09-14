import { createClient } from "./supabase/client";
import { billAction } from "./billAction";
import { transactionAction } from "./transactionAction";
import { billerAction } from "./billerAction";
export const bpayAction = {
    fetchBillByBillerReference:async (billercode:string,reference:string):Promise<Partial<Bill>[]>=>{
        const supabase = createClient();
        const {data,error} = await supabase
        .from('bill')
        .select('*')
        .eq('reference_number',reference)
        if (error){
            throw error;
        }
        return data;
    },
    createPayment:async(bill:Bill,user_id:string, fromAccount:Account,amount:number,description:string):Promise<void>=>{
        const supabase =createClient();
        const bills=await billAction.fetchAssignedBills(user_id,bill.from);
        const transaction={
            from:fromAccount.id,
            
            amount:amount,
            description:description,
            created_on:new Date(),
            status:'success'
        }


    }
}