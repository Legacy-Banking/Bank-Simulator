import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import AdminAccountBox from '@/components/AdminAccountBox'; // Import the new AdminAccountBox component
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/Spinner';
import { accountAction } from '@/lib/actions/accountAction';

// Define the props type for the component
type AccountDetailSheetProps = {
  accounts: Account[],
  status: boolean;
  onClose: () => void;
};

const OpenUserAccountsDetailSheet: React.FC<AccountDetailSheetProps> = ({ accounts, status, onClose }) => {
  // State for loading
  const [loading, setLoading] = useState(true);
  const [updatedAccounts, setUpdatedAccounts] = useState<Account[]>(accounts);

  // Fetch updated accounts
  const refreshAccounts = async () => {
    try {
      const fetchedAccounts = await accountAction.fetchAccountsbyUserId(accounts[0].owner);
      setUpdatedAccounts(fetchedAccounts); // Update the state with the new account data
    } catch (error) {
      console.error("Error fetching updated accounts:", error);
    }
  };

  // Set loading state to false after accounts are loaded
  useEffect(() => {
    if (status) {
      setLoading(true); // Set loading to true when dialog opens
      refreshAccounts();
      setTimeout(() => {
        setLoading(false); // Simulate data loading (replace with actual fetching logic if needed)
      }, 200); // Adjust the delay as per the real loading time
    }
  }, [status]);

  // Check if status is false, render nothing
  if (!status) return null;

  // Filter accounts by type to ensure ordering in the UI
  const personalAccount = updatedAccounts.find(acc => acc.type === 'personal');
  const savingsAccount = updatedAccounts.find(acc => acc.type === 'savings');
  const creditAccount = updatedAccounts.find(acc => acc.type === 'credit');

  return (
    <Dialog open={!!status} onOpenChange={onClose}>
      <DialogContent className="bg-white-100 p-6 min-h-[78vh] max-w-[700px] rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="font-inter text-2xl font-semibold mb-1 mt-4">
            <span className='text-blackText-50'>
              <span className="text-blue-25">{accounts.at(0)?.owner_username}'s</span> Accounts
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="h-0.5 bg-blue-200 my-4"></div>

        {/* Display Account Boxes */}
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Spinner size="large" show={true} />
          </div>
        ) : (
          // Display Account Boxes when data is loaded
          <div className="flex flex-col gap-8">
            {personalAccount && <AdminAccountBox account={personalAccount} refreshAccounts={refreshAccounts} />}
            {savingsAccount && <AdminAccountBox account={savingsAccount} refreshAccounts={refreshAccounts} />}
            {creditAccount && <AdminAccountBox account={creditAccount} refreshAccounts={refreshAccounts} />}
          </div>
        )}

        <div className="h-0.5 bg-blue-200 my-4"></div>

        {/* Footer with Close button */}
        <DialogFooter className="flex justify-end">
          <Button onClick={onClose} className="text-base px-6 bg-white-100 font-semibold border border-gray-300 shadow-form hover:bg-slate-200">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OpenUserAccountsDetailSheet;
