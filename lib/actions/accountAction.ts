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
    signUpInitialization: async (user_id: string, owner_username: string): Promise<void> => {

        // Fetch preset bills using the new function in billerAction
        const presetBills = await billAction.fetchPresetBills();

        const accounts: Partial<Account>[] = await accountAction.fetchAccountPresets(user_id, owner_username);
        for (const account of accounts) {
            await accountAction.createAccount(account as Account);
        }

        console.log("userAccounts:", accounts);

        await cardAction.cardSignUpInitialization(user_id, accounts);

        await billerAction.createDefaultSavedBillers(user_id);

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
