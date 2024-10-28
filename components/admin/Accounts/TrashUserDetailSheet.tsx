import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/shadcn_ui/dialog';
import { Button } from '@/components/shadcn_ui/button';
import { cn, formatAmount, formatDateTime } from "@/lib/utils/utils"
import { createClient } from '@/lib/supabase/client';
import { serviceRoleClient } from '@/lib/supabase/serviceRoleClient';

// Define the props type for the component
type UserDetailSheetProps = {
  account: Account | null,
  status: boolean;
  onClose: () => void;
  deleteUser: () => void;
};



const TrashUserDetailSheet: React.FC<UserDetailSheetProps> = ({ account, status, onClose, deleteUser }) => {
  if (!status) return null;

  const [error, setError] = useState('');

  const supabase = createClient();

  async function deleteAccountsByOwnerUsername(ownerUsername: string | undefined, ownerId: string | undefined) {
    if (!ownerUsername) {
      return;
    }
  
    try {
      // Delete cards based on owner_username first (since they have a foreign key constraint)
      const { data: cardData, error: cardError } = await supabase
        .from('cards') // Replace with your cards table name
        .delete()
        .eq('owner_username', ownerUsername); // Match by owner_username
  
      if (cardError) {
        throw new Error(`Error deleting cards: ${cardError.message}`);
      } else {
        console.log('Cards deleted:', cardData);
      }
      // alter the transactions this account has affected other accounts
      const { data: fromAccountData, error: fromAccountError } = await supabase
      .from('transaction')
      .update({
        from_account: null,
        from_account_username: '(Deleted User)'
      })
      .eq('from_account_username', ownerUsername)
      .eq('transaction_type', 'pay anyone'); // Only update for 'pay anyone' transactions

    if (fromAccountError) {
      throw new Error(`Error updating transactions (payer): ${fromAccountError.message}`);
    } else {
      console.log('Updated transactions for payer:', fromAccountData);
    }

    // Update transactions where the deleted user is the recipient (to_account) for 'pay anyone' type only
    const { data: toAccountData, error: toAccountError } = await supabase
      .from('transaction')
      .update({
        to_account: null,
        to_account_username: '(Deleted User)'
      })
      .eq('to_account_username', ownerUsername)
      .eq('transaction_type', 'pay anyone'); // Only update for 'pay anyone' transactions

    if (toAccountError) {
      throw new Error(`Error updating transactions (recipient): ${toAccountError.message}`);
    } else {
      console.log('Updated transactions for recipient:', toAccountData);
    }

    // Delete transactions for other transaction types (not 'pay anyone')
    const { data: otherTransactions, error: otherTransactionsError } = await supabase
        .from('transaction')
        .select('from_account_username');

        if (otherTransactionsError) {
          throw new Error(`Error fetching Other Transactions: ${otherTransactionsError.message}`);
        }

        // Iterate over the otherTransactions and extract the ownerUsername part
        const filteredTransactions = otherTransactions.filter(transaction => {
          const usernamePart = transaction.from_account_username.split(' - ')[0]; // Split by ' - ' and take the first part (e.g., 'fred8')
          return usernamePart === ownerUsername;
        });

        // If there are any filtered otherTransactions, proceed to delete
        if (filteredTransactions.length > 0) {
          const { data: deleteData, error: deleteError } = await supabase
            .from('transaction')
            .delete()
            .in('from_account_username', filteredTransactions.map(t => t.from_account_username)); // Deleting all matching otherTransactions

          if (deleteError) {
            throw new Error(`Error deleting Other Transactions: ${deleteError.message}`);
          }

          console.log('Deleted Other Transactions for owner:', deleteData);
        }
      
      // Now delete accounts based on owner_username
      const { data: accountData, error: accountError } = await supabase
        .from('account') // Replace with your accounts table name
        .delete()
        .eq('owner_username', ownerUsername); // Match by owner_username
  
      if (accountError) {
        throw new Error(`Error deleting accounts: ${accountError.message}`);
      } else {
        console.log('Accounts deleted:', accountData);
      }
  
      // Delete messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages') // Replace with your messagess table name
        .delete()
        .eq('to_user', ownerId); // Match by ownerId

      if (messagesError) {
        throw new Error(`Error deleting messagess: ${messagesError.message}`);
      } else {
        console.log('Messages deleted:', messagesData);
      }

      // User Billers
      const { data: userBillerData, error: userBillerError } = await supabase
        .from('user_billers') // Replace with your userBillers table name
        .delete()
        .eq('owner', ownerId); // Match by ownerId

      if (userBillerError) {
        throw new Error(`Error deleting User Biller: ${userBillerError.message}`);
      } else {
        console.log('User Biller deleted:', userBillerData);
      }

      // Bills 
      const { data: billsData, error: billsError } = await supabase
        .from('bills') // Replace with your billss table name
        .delete()
        .eq('billed_user', ownerId); // Match by ownerId

      if (billsError) {
        throw new Error(`Error deleting Bill: ${billsError.message}`);
      } else {
        console.log('Bill deleted:', billsData);
      }

      // Admin bills
      updateAdminBills(ownerUsername, ownerId);


      // Schedule payments

      // From [related user]
      const { data: fromSchedulePaymentData, error: fromSchedulePaymentError } = await supabase
      .from('schedule_payments') // Replace with your fromSchedulePayments table name
      .delete()
      .eq('related_user', ownerId); // Match by ownerId

      if (fromSchedulePaymentError) {
        throw new Error(`Error deleting From Scheduled Payment: ${fromSchedulePaymentError.message}`);
      } else {
        console.log('From Schedule Payment deleted:', fromSchedulePaymentData);
      }

      // To
      // const { data: toSchedulePaymentData, error: toSchedulePaymentError } = await supabase
      // .from('schedule_payments') // Replace with your toSchedulePayments table name
      // .delete()
      // .eq('to_account', ownerId); // Match by ownerId

      // if (toSchedulePaymentError) {
      //   throw new Error(`Error deleting To Scheduled Payment: ${toSchedulePaymentError.message}`);
      // } else {
      //   console.log('To Schedule Payment deleted:', toSchedulePaymentData);
      // }

      // Delete Admin User
      const { data: adminUserData, error: adminUserError } = await supabase
      .from('admin_users') // Replace with your adminUsers table name
      .delete()
      .eq('id', ownerId); // Match by ownerId

      if (adminUserError) {
        throw new Error(`Error deleting Admin User: ${adminUserError.message}`);
      } else {
        console.log('Admin User deleted:', adminUserData);
      }


      // Delete from supabase [hard delete]
      const supabaseAdmin = serviceRoleClient();
      const { data, error } = await supabaseAdmin.auth.admin.deleteUser(ownerId!);

      if (error) {
        setError(error.message);
        console.error('Error deleting user:', error.message);
      } else {
        setError('');
        console.log('User deleted:', data);
      }

      // Call parent function or refresh data after deletion
      deleteUser(); // Assuming you have a function to refresh the data
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
        console.error('Error occurred: ', error.message);
      } else {
        console.error('Unexpected error occurred', error);
      }
    }
  }
  
  async function updateAdminBills(ownerUsername: string | undefined, ownerId: string | undefined) {
    try {
      // Fetch admin_bills data
      const { data: adminBills, error: adminBillsError } = await supabase
        .from('admin_bills')
        .select('*');
  
      if (adminBillsError) {
        throw new Error(`Error fetching admin bills: ${adminBillsError.message}`);
      }
  
      // Build the exact string to be removed (e.g., "fred15|12345")
    const userToDelete = `${ownerUsername}|${ownerId}`;

    // Iterate through each bill and remove the specific user
    const updatedBills = adminBills.map(bill => {
      // Check if assigned_users is a string or array and split only if it's a string
      let assignedUsers = Array.isArray(bill.assigned_users)
        ? bill.assigned_users
        : bill.assigned_users.split(', ');

      return {
        ...bill,
        assigned_users: assignedUsers
          .filter((user: string) => user !== userToDelete) // Filter out the user
          .join(', ') // Join the array back into a string
      };
    });

      for (const bill of updatedBills) {
        const { error: updateError } = await supabase
          .from('admin_bills')
          .update({ assigned_users: bill.assigned_users })  // Update the 'assigned_users' field
          .eq('id', bill.id);  // Use 'id' to target the specific row for update

        if (updateError) {
          throw new Error(`Error updating bill ${bill.id}: ${updateError.message}`);
        }
      }
      console.log('All bills updated successfully');
    } catch (error) {
      console.error('Error processing admin bills:', error);
    }

 
  }
  
  
  
  

  return (
    <Dialog open={!!status} onOpenChange={onClose}>
      <DialogContent className="bg-white-100 p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold font-inter mb-10">Confirm Delete</DialogTitle>
          <DialogDescription className="text-base font-inter text-[#191919] border-blue-25 border-y-2 py-4">
          Are you sure you want to delete user <span className="text-blue-500">{account?.owner_username}</span> permanently? <br />
          <br />
          You can’t undo this action.
          </DialogDescription>
        </DialogHeader>
        {/* Error Message */}
        {error && (
            <div className="font-semibold text-red-500">
              {error}
            </div>
          )}
        {/* Footer with Close button */}
        <DialogFooter className="mt-8 flex ">
            <Button onClick={onClose} className="grow uppercase font-inter border-2 hover:bg-slate-200 tracking-wider">Cancel</Button>
          <Button onClick={(e) => deleteAccountsByOwnerUsername(account?.owner_username, account?.owner)} className="grow uppercase font-inter tracking-wider bg-blue-25 hover:bg-blue-200 text-white-100">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TrashUserDetailSheet;
