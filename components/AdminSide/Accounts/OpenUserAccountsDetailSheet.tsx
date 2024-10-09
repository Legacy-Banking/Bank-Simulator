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
import { accountAction } from '@/lib/actions/accountAction';

// Skeleton Loader for Account Boxes
const SkeletonAccountBox: React.FC = () => {
  return (
    <div className="animate-pulse flex items-center justify-between p-6 rounded-lg shadow-lg bg-gray-200">
      <div className="flex flex-col gap-2">
        <div className="h-6 w-32 bg-gray-300 rounded"></div>
        <div className="h-6 w-24 bg-gray-300 rounded"></div>
      </div>
      <div className="h-8 w-8 bg-gray-300 rounded-md"></div>
    </div>
  );
};

// Define the props type for the component
type AccountDetailSheetProps = {
  accounts: Account[],
  status: boolean;
  onClose: () => void;
};

const OpenUserAccountsDetailSheet: React.FC<AccountDetailSheetProps> = ({ accounts, status, onClose }) => {
  // State for loading
  const [loading, setLoading] = useState(false);
  const [updatedAccounts, setUpdatedAccounts] = useState<Account[]>(accounts); // Use initial accounts as fallback

  // Fetch updated accounts
  const refreshAccounts = async () => {
    setLoading(true); // Ensure loading is set to true
    try {
      if (accounts.length > 0) {
        const fetchedAccounts = await accountAction.fetchAccountsbyUserId(accounts[0].owner);
        setUpdatedAccounts(fetchedAccounts);
      }
    } catch (error) {
      console.error("Error fetching updated accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch accounts when the dialog opens
  useEffect(() => {
    if (status) {
      refreshAccounts();
    }
  }, [status]);

  if (!status) return null;

  // Use either the updated accounts or fallback to the initial accounts
  const activeAccounts = updatedAccounts.length > 0 ? updatedAccounts : accounts;

  // Filter accounts by type to ensure ordering in the UI
  const personalAccount = activeAccounts.find(acc => acc.type === 'personal');
  const savingsAccount = activeAccounts.find(acc => acc.type === 'savings');
  const creditAccount = activeAccounts.find(acc => acc.type === 'credit');

  return (
    <Dialog open={!!status} onOpenChange={onClose}>
      <DialogContent className="bg-white-100 p-6 min-h-[78vh] max-w-[700px] rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="font-inter text-2xl font-semibold mb-1">
            <span className='text-blackText-50'>
              <span className="text-blue-25">{accounts.at(0)?.owner_username}'s</span> Accounts
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="h-0.5 bg-blue-200 my-4"></div>

        {/* Display Account Boxes or Skeleton Loaders */}
        {loading ? (
          // Show skeleton loaders for account boxes when loading
          <div className="flex flex-col gap-8">
            <SkeletonAccountBox />
            <SkeletonAccountBox />
            <SkeletonAccountBox />
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
        <DialogFooter className="mt-4 flex justify-end">
          <Button onClick={onClose} className="bg-gray-200">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OpenUserAccountsDetailSheet;
