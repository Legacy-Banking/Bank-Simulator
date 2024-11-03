import { createClient } from "../supabase/client";
import { accbsbGenerator } from "../utils/accbsbGenerator";
import { billAction } from "./billAction";
import { billerAction } from './billerAction';
import { cardAction } from "./cardAction";
import { transactionAction } from "./transactionAction";

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
    fetchAccountsTotalBalance: async (user_id: string): Promise<number> => {
        const supabase = createClient();

        // Sum the balance of all accounts for a given user
        const { data, error } = await supabase
            .from('account')
            .select('balance') // Fetch only the balance column
            .eq('owner', user_id);

        if (error) {
            console.error('Error fetching total balance:', error);
            throw error;
        }

        // If no accounts found, return 0 as the total balance
        if (!data || data.length === 0) {
            return 0;
        }

        // Calculate the total balance
        const totalBalance = data.reduce((sum, account) => sum + account.balance, 0);

        return totalBalance;
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
    fetchAccountTypebyId: async (id: string): Promise<string> => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('account')
            .select('type')
            .eq('id', id);

        if (error) {
            console.error('Error fetching Account Type:', error);
            throw error;
        }

        const accountType = data?.[0]?.type;
        return accountType;
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

    createAccounts: async (accounts: Account[]): Promise<void> => {
        const supabase = createClient();
        const { error } = await supabase
            .from('account')
            .insert(accounts); // Insert multiple accounts at once
    
        if (error) {
            throw new Error(error.message);
        }
    },
    
    signUpInitialization: async (user_id: string, owner_username: string): Promise<void> => {

        // Fetch preset bills, transactions presets, and account presets in parallel
        const [presetBills, accounts, savedBillers] = await Promise.all([
            billAction.fetchPresetBills(),
            accountAction.fetchAccountPresets(user_id, owner_username),
            billerAction.fetchPresetSavedBillers(),
        ]);
    
        // Create accounts and saved billers in parallel
        await Promise.all([
            accountAction.createAccounts(accounts as Account[]),  // Create accounts in bulk
            billerAction.createDefaultSavedBillers(user_id, savedBillers) // Create saved billers
        ]);
    
        // Initialize card for the user
        await cardAction.cardSignUpInitialization(user_id);
    
        // Loop through fetched bills and create bills for the user
        for (const bill of presetBills) {
            await billAction.createBillForUsers(
                [user_id], // The single user being assigned the bill
                bill.biller, // Biller from the preset bill
                bill.amount, // Amount from the preset bill
                bill.description, // Description from the preset bill
                new Date(bill.due_date), // Due date from the preset bill
                bill.id // Linked bill from the preset bill
            );
    
            // Update the assigned_users in the Admin Bill
            const { assigned_users: currentAssignedUsers } = await billAction.fetchAdminBillById(bill.id);
            const newUserAssignment = `${owner_username}|${user_id}`;
            const existingUserArray = currentAssignedUsers
                ? currentAssignedUsers.split(",").map((user: string) => user.trim())
                : [];
            const updatedAssignedUsersArray = [...existingUserArray, newUserAssignment].filter(
                (value, index, self) => self.indexOf(value) === index
            );
            const updatedAssignedUsers = updatedAssignedUsersArray.join(", ");
            await billAction.updateAssignedUsers(bill.id, updatedAssignedUsers);
        }
    
        // Fetch the user's personal account and transaction presets
        const transactionsPreset = await transactionAction.fetchTransactionPresetsOnCreation();
        const personalAcc = await accountAction.fetchPersonalAccountByUserId(user_id);
        // Loop through transaction presets and create transactions for the user
        for (const transaction of transactionsPreset) {
            await transactionAction.createTransactionPreset(
                transaction.recipient,
                personalAcc,
                owner_username,
                transaction.amount,
                'A preset transaction',
                transaction.date_issued
            );
        }
    },
    

    finalizeSignUpInitialization: async (user_id: string, owner_username: string): Promise<void> => {

        // Fetch preset bills and account presets in parallel
        const [presetBills] = await Promise.all([
            billAction.fetchPresetBills(),
        ]);


        // Loop through fetched bills and create bills for the user
        for (const bill of presetBills) {
            await billAction.createBillForUsers(
                [user_id], // The single user being assigned the bill
                bill.biller, // Biller from the preset bill
                bill.amount, // Amount from the preset bill
                bill.description, // Description from the preset bill
                new Date(bill.due_date), // Due date from the preset bill
                bill.id // Linked bill from the preset bill
            );
    
            // Now update the assigned_users in the Admin Bill
            // Fetch the current assigned users for the linked bill
            const { assigned_users: currentAssignedUsers } = await billAction.fetchAdminBillById(bill.id);
    
            // Create a string with the user details (username|id)
            const newUserAssignment = `${owner_username}|${user_id}`;
    
            // If there are already assigned users, split them into an array, otherwise start with an empty array
            const existingUserArray = currentAssignedUsers
                ? currentAssignedUsers.split(",").map((user: string) => user.trim())
                : [];
    
            // Add the new user to the list and remove duplicates
            const updatedAssignedUsersArray = [...existingUserArray, newUserAssignment].filter(
                (value, index, self) => self.indexOf(value) === index
            );
    
            // Join the updated array into a string
            const updatedAssignedUsers = updatedAssignedUsersArray.join(", ");
    
            // Update the admin bill with the new assigned users list
            await billAction.updateAssignedUsers(bill.id, updatedAssignedUsers);
        } 
    },

    fetchAccountPresets: async (userId: string, ownerUsername: string): Promise<Partial<Account>[]> => {

        const supabase = createClient();

        const { data, error } = await supabase
            .from('account_presets')
            .select('*')
            
        if (error) {
            console.error('Error fetching account presets:', error);
            throw error;
        }

        if (!data || data.length === 0) {
            console.warn('No account presets found');
            return [];
        }
        const accounts = data as AccountPresetType[];
        const incurredPayments = await transactionAction.fetchTotalTransactionAmount();
        
        // Assuming `fetchedAccounts` is the result of fetching from the database
        const transformedData = accounts.map(account => {
            // const currBalance = account.account_type == AccountType.CREDIT ? account.starting_balance - incurredPayments : account.starting_balance + incurredPayments;
            const currBalance = account.account_type == AccountType.PERSONAL ? account.starting_balance + incurredPayments : account.starting_balance;
            const commonFields = {
                type: account.account_type,
                balance: currBalance,
                owner: userId,
                opening_balance: account.starting_balance,
                owner_username: ownerUsername,
            };
    
            if (account.account_type == AccountType.PERSONAL || account.account_type == AccountType.SAVINGS) {
                const { bsb, acc } = accbsbGenerator();
                return { ...commonFields, bsb, acc };
            } else if (account.account_type === AccountType.CREDIT) {
                const { acc } = accbsbGenerator();
                return { ...commonFields, bsb: null, acc };
            }
            
    
            return { ...commonFields, bsb: null, acc: null };
        });
        
        return transformedData as Partial<Account>[];
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
