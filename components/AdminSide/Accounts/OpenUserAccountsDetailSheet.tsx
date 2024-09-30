import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Table } from 'lucide-react';
import { formatAmount } from '@/lib/utils';

// Define the props type for the component
type AccountDetailSheetProps = {
  accounts: Account[],
  status: boolean;
  onClose: () => void;
};

const OpenUserAccountsDetailSheet: React.FC<AccountDetailSheetProps> = ({ accounts, status, onClose }) => {

  // Check if status is false, render nothing
  if (!status) return null;
  console.log(accounts);

  return (
    <Dialog open={!!status} onOpenChange={onClose}>
      <DialogContent className="bg-white-100 p-6 max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold mb-4">
            {accounts.length} Accounts Found for <span className='text-blue-500'>{accounts.at(0)?.owner_username}</span>
          </DialogTitle>
        </DialogHeader>

        {/* Table for displaying accounts */}
        <ul>
          {accounts.map((acc) => (
            <li className="font-inter mb-1 font-bold" key={acc.id}>{acc.type.toUpperCase()} - <span className='font-medium'>{formatAmount(acc.balance)} </span></li>
          ))}
        </ul>


        {/* Footer with Close button */}
        <DialogFooter className="mt-4 flex justify-end">
          <button 
            className="px-4 py-2 bg-blue-500 text-white-100 rounded" 
            onClick={onClose}
          >
            Close
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OpenUserAccountsDetailSheet;
