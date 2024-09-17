import { createClient } from "./supabase/client";
import { accbsbGenerator } from "./accbsbGenerator";
import { transactionAction } from "./transactionAction";
import { billerAction } from './billerAction';

enum AccountType {
    SAVINGS = 'savings',
    PERSONAL = 'personal',
    CREDIT = 'credit',
    DEBIT = 'debit',
    OTHER = 'other'
}

export const accountAction = {
    fetchAccountsbyUserId: async (user_id: string): Promise<Account[]> => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('account')
            .select('*')
            .eq('owner', user_id)
            .order('id', { ascending: true }); // Sort by 'id' in ascending order

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
    //This should be admin only
    fetchAllAccounts: async (): Promise<Account[]> => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('account')
            .select('*');
        if (error) {
            throw new Error(error.message);
        }
        return data || [];
    },

    // Fetch an account by BSB and account number
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
    },

    fetchPersonalAccountByUserId: async (user_id: string) => {
        const supabase = createClient();

        const { data, error } = await supabase
            .from('account')
            .select('*')
            .eq('owner', user_id)
            .eq('type', 'personal'); // Fetch only personal accounts

        if (error) {
            console.error('Error fetching personal account:', error);
            throw error;
        }

        if (data && data.length > 0) {
            return data[0]; // Return the first personal account found
        } else {
            console.error('No personal account found for the user.');
            return null;
        }
    },

    createAccount: async (account: Account): Promise<void> => {
        const supabase = createClient();
        const { error } = await supabase
            .from('account')
            .insert(account);

        if (error) {
            throw new Error(error.message);
        }
    },
    signUpInitialization: async (user_id: string): Promise<void> => {
        const { bsb: perbsb, acc: peracc } = accbsbGenerator();
        const { bsb: savbsb, acc: savacc } = accbsbGenerator();

        const accounts: Partial<Account>[] = [
            {
                type: AccountType.SAVINGS,
                balance: 1000,
                owner: user_id,
                bsb: savbsb,
                acc: savacc,
                opening_balance: 1000,
            },
            {
                type: AccountType.PERSONAL,
                balance: 1000,
                owner: user_id,
                bsb: perbsb,
                acc: peracc,
                opening_balance: 1000,
            }
        ];
        accounts.forEach(async (account) => {
            await accountAction.createAccount(account as Account);
        });
        await billerAction.createDefaultSavedBillers(user_id);

        //Need to also generate Cards with their number and CSV
        //Generate their bills
        //Generate default transaction history
    },

    fetchUsernamebyUserId: async (user_id: string): Promise<string> => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('account')
            .select('owner_username')
            .eq('owner', user_id);

        if (error) {
            console.error('Error fetching Owner Username:', error);
            throw error;
        }

        const ownerUsername = data?.[0]?.owner_username || 'Guest';
        return ownerUsername;
    },

    //fetch account type
    fetchAccountType: async (account_id: string): Promise<string> => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('account')
            .select('type')
            .eq('id', account_id)
            .single();

        if (error) {
            console.error('Error fetching Account Type:', error);
            throw error;
        }

        return data.type;
    },
}
