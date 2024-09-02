import { createClient } from "./supabase/client";
import { Transaction } from "@/types/Transaction";
import { Account } from "@/types/Account";

export const transactionAction = {
    createTransaction: (fromAccount: Account, toAccount: Account, amount: number, description:string): void => {
        const fromNewBalance = fromAccount.balance - amount;
        const toNewBalance = toAccount.balance + amount;
        transactionAction.updateAccounts(fromAccount, fromNewBalance);
        transactionAction.updateAccounts(toAccount, toNewBalance);
        const newTransaction: Partial<Transaction> = {
            description: description,
            amount: amount,
            paid_on: new Date(),
            from_account: fromAccount.id,
            to_account: toAccount.id
        };
        const supabase = createClient();
        supabase.from('transaction').insert([newTransaction]);
        
    },
    updateAccounts:(account:Account, newBalance:number):void => {
        const supabase = createClient();
        supabase.from('account').update({balance:newBalance}).eq('id',account.id);
    }
};
