import { createClient } from "./supabase/client";

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
        supabase.from('transaction').insert(newTransaction)
    },
    updateAccounts:(account:Account, newBalance:number):void => {
        const supabase = createClient();
        supabase.from('account').update({balance:newBalance}).eq('id',account.id)
    },
    getTransactionsByAccountId: async (accountId: string): Promise<Transaction[]> => {
        const supabase = createClient();
        
        const { data, error } = await supabase
          .from('transaction')
          .select('*')
          .or(`from_account.eq.${accountId},to_account.eq.${accountId}`);
          
        if (error) {
          console.error('Error fetching transactions:', error);
          throw error;
        }
    
        return data as Transaction[];
      },
};
