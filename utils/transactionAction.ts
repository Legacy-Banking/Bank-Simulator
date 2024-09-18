import { createClient } from "./supabase/client";
import { randomNameGenerator } from "./randomNameGenerator";
import { accountAction } from "./accountAction";

export const transactionAction = {
    createTransaction: async (fromAccount: Account, toAccount: Account, amount: number, description: string, transactionType: string): Promise<void> => {
        const supabase = createClient();

        const fromNewBalance = fromAccount.balance - amount;
        const toNewBalance = toAccount.balance + amount;

        let from_username: string;
        let to_username: string;

        if (transactionType === 'transfer funds') {
            from_username = fromAccount.type;  
            to_username = toAccount.type; 
        } else if (transactionType === 'pay anyone') {
            from_username = fromAccount.owner_username;
            to_username = toAccount.owner_username;
        } else {
            throw new Error(`Unsupported transaction type: ${transactionType}`);
        }


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
                from_account_username: from_username,
                to_account: toAccount.id,
                to_account_username: to_username,
                transaction_type: transactionType,
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

    createBPAYTransaction: async (
        fromAccount: Account,
        billerName: string,
        billerCode: string,
        referenceNum: string,
        amount: number,
        description: string,
        cardDetails: { cardNumber: string | undefined; expiryDate: string | undefined; cvv: string | undefined } | null
    ): Promise<void> => {
        const supabase = createClient();

        const fromNewBalance = fromAccount.balance - amount;

        if (fromNewBalance < 0) {
            throw new Error('Insufficient funds');
        }

        try {
            // Update the 'from' account balance
            await transactionAction.updateAccounts(fromAccount, fromNewBalance);

            // Construct the detailed description including biller details
            const detailedDescription = `${description} | Biller: ${billerName}, Code: ${billerCode}, Ref: ${referenceNum}`;

            // Insert the new BPAY transaction
            const newTransaction: Partial<Transaction> = {
                description: detailedDescription,
                amount: amount,
                paid_on: new Date(),
                from_account: fromAccount.id,
                from_account_username: fromAccount.owner_username,
                to_account_username: billerName,
                //reference_number: referenceNum,
                //card_number: cardDetails?.cardNumber || null,  // Optional card details
                //expiry_date: cardDetails?.expiryDate || null,
                //cvv: cardDetails?.cvv || null,
                transaction_type: "bpay",
            };

            const { error: insertError } = await supabase
                .from('transaction')
                .insert(newTransaction);

            if (insertError) {
                await transactionAction.updateAccounts(fromAccount, fromAccount.balance);

                console.error('Failed to insert the BPAY transaction:', insertError);
                throw new Error('Transaction failed, reverting operations.');
            }
        } catch (error) {
            console.error('Transaction error:', error);
            await transactionAction.updateAccounts(fromAccount, fromAccount.balance);
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
            .or(`from_account.eq.${accountId},to_account.eq.${accountId}`)
            .order('paid_on', { ascending: false });

        if (error) {
            console.error('Error fetching transactions:', error);
            throw error;
        }

        const transactions = data as Transaction[];
        transactionAction.processTransactionsForAccount(transactions, accountId);
        return transactions;
    },

    processTransactionsForAccount: (transactions: Transaction[], accountId: string): void => {
        transactions.forEach((t) => {
            t.amount = t.from_account.toString() === accountId ? -t.amount : t.amount;
            // if (!t.from_account_username) {
            //     t.from_account_username = randomNameGenerator();
            // }
            // if (!t.to_account_username) {
            //     t.to_account_username = randomNameGenerator();
            // }

        });
    },
};


