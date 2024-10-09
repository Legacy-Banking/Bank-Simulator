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

// Skeleton Loader for Account Balances
const SkeletonBalance: React.FC = () => (
  <div className="animate-pulse h-6 w-24 bg-gray-300 rounded"></div>
);

// Define the props type for the component
type AccountDetailSheetProps = {
  accounts: Account[],
  status: boolean;
  loading: boolean;
  onClose: () => void;
};

const OpenUserAccountsDetailSheet: React.FC<AccountDetailSheetProps> = ({ accounts, status, loading, onClose }) => {
  const [updatedAccounts, setUpdatedAccounts] = useState<Account[]>(accounts); // Initialize with fallback accounts

  // Fetch updated accounts when the dialog opens
  const refreshAccounts = async () => {
    try {
      if (accounts.length > 0) {
        const fetchedAccounts = await accountAction.fetchAccountsbyUserId(accounts[0].owner);
        setUpdatedAccounts(fetchedAccounts); // Set the updated accounts
      }
    } catch (error) {
      console.error("Error fetching updated accounts:", error);
    }
  };

  useEffect(() => {
    if (status) {
      refreshAccounts(); // Trigger fetch when the dialog opens
    }
  }, [status, accounts]);

  // Filter accounts by type for rendering
  const personalAccount = updatedAccounts.find(acc => acc.type === 'personal');
  const savingsAccount = updatedAccounts.find(acc => acc.type === 'savings');
  const creditAccount = updatedAccounts.find(acc => acc.type === 'credit');

  if (!status) return null;

  return (
    <Dialog open={!!status} onOpenChange={onClose}>
      <DialogContent className="bg-white-100 p-6 min-h-[78vh] max-w-[700px] rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="font-inter text-2xl font-semibold mb-1 mt-4">
            <span className='text-blackText-50'>
              <span className="text-blue-25">{accounts[0]?.owner_username}'s</span> Accounts
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="h-0.5 bg-blue-200 my-4"></div>

        {/* Show the AdminAccountBox immediately, but display a skeleton for balance while loading */}
        <div className="flex flex-col gap-8">
          {personalAccount && (
            <AdminAccountBox
              account={personalAccount}
              balance={loading ? <SkeletonBalance /> : `$${personalAccount.balance?.toFixed(2)}`}
              refreshAccounts={refreshAccounts}
            />
          )}
          {savingsAccount && (
            <AdminAccountBox
              account={savingsAccount}
              balance={loading ? <SkeletonBalance /> : `$${savingsAccount.balance?.toFixed(2)}`}
              refreshAccounts={refreshAccounts}
            />
          )}
          {creditAccount && (
            <AdminAccountBox
              account={creditAccount}
              balance={loading ? <SkeletonBalance /> : `$${creditAccount.balance?.toFixed(2)}`}
              refreshAccounts={refreshAccounts}
            />
          )}
        </div>

        <div className="h-0.5 bg-blue-200 my-4"></div>

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
