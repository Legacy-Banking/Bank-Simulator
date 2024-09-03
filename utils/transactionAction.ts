import { createClient } from "./supabase/client";

export const transactionAction = {
    createTransaction: async (fromAccount: Account, toAccount: Account, amount: number, description: string): Promise<void> => {
        const supabase = createClient();

        const fromNewBalance = fromAccount.balance - amount;
        const toNewBalance = toAccount.balance + amount;

        if (fromNewBalance < 0) {
            throw new Error('Insufficient funds');
        }

        try {
            // Update the 'from' account balance
            await transactionAction.updateAccounts(fromAccount, fromNewBalance);

            // Update the 'to' account balance
            await transactionAction.updateAccounts(toAccount, toNewBalance);

            // Insert the new transaction
            const newTransaction: Partial<Transaction> = {
                description: description,
                amount: amount,
                paid_on: new Date(),
                from_account: fromAccount.id,
                to_account: toAccount.id,
            };

            const { error: insertError } = await supabase
                .from('transaction')
                .insert(newTransaction);

            if (insertError) {
                // Revert both account updates if the transaction insertion fails
                await transactionAction.updateAccounts(fromAccount, fromAccount.balance);
                await transactionAction.updateAccounts(toAccount, toAccount.balance);

                console.error('Failed to insert the transaction:', insertError);
                throw new Error('Transaction failed, reverting operations.');
            }
        } catch (error) {
            // If updating either account fails, revert any successful updates
            console.error('Transaction error:', error);

            if (fromAccount.balance !== fromNewBalance) {
                await transactionAction.updateAccounts(fromAccount, fromAccount.balance);
            }

            if (toAccount.balance !== toNewBalance) {
                await transactionAction.updateAccounts(toAccount, toAccount.balance);
            }

            throw error;
        }
    },

    updateAccounts: async (account: Account, newBalance: number): Promise<void> => {
        const supabase = createClient();
        const { error } = await supabase
            .from('account')
            .update({ balance: newBalance })
            .eq('id', account.id);

        if (error) {
            throw new Error(`Failed to update account ${account.id}: ${error.message}`);
        }
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
