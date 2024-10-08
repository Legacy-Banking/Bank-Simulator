import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import AdminAccountBox from '@/components/AdminAccountBox'; // Import the new AdminAccountBox component
import { Button } from '@/components/ui/button';

// Define the props type for the component
type AccountDetailSheetProps = {
  accounts: Account[],
  status: boolean;
  onClose: () => void;
};

const OpenUserAccountsDetailSheet: React.FC<AccountDetailSheetProps> = ({ accounts, status, onClose }) => {
  // Check if status is false, render nothing
  if (!status) return null;

  // Filter accounts by type to ensure ordering in the UI
  const personalAccount = accounts.find(acc => acc.type === 'personal');
  const savingsAccount = accounts.find(acc => acc.type === 'savings');
  const creditAccount = accounts.find(acc => acc.type === 'credit');

  return (
    <Dialog open={!!status} onOpenChange={onClose}>
      <DialogContent className="bg-white-100 p-6 max-w-[700px] rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="font-inter text-2xl font-semibold mb-1">
            <span className='text-blackText-50'>{accounts.at(0)?.owner_username}'s Accounts</span>
          </DialogTitle>
        </DialogHeader>

        <div className="h-0.5 bg-blue-200 my-4"></div>

        {/* Display Account Boxes */}
        <div className="flex flex-col gap-8">
          {personalAccount && <AdminAccountBox account={personalAccount} />}
          {savingsAccount && <AdminAccountBox account={savingsAccount} />}
          {creditAccount && <AdminAccountBox account={creditAccount} />}
        </div>

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