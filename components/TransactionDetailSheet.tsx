import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { formatAmount, formatDateTime } from "@/lib/utils";

// Define the props type for the component
type TransactionDetailSheetProps = {
  transaction: Transaction | null;
  onClose: () => void;
};

const TransactionDetailSheet: React.FC<TransactionDetailSheetProps> = ({ transaction, onClose }) => {
  if (!transaction) return null; // Exit early if no transaction is provided

  return (
    <Dialog open={!!transaction} onOpenChange={onClose}>
      <DialogContent className="bg-white-100 p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Transaction Details</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Detailed information about the selected transaction.
          </DialogDescription>
        </DialogHeader>

        {/* Transaction details */}
        <div className="space-y-4">
          <p className="text-base">
            <strong>To:</strong> {transaction.to_account ? `${transaction.to_account_username}` : `(Biller) ${transaction.to_account_username}`}
          </p>
          <p className="text-base">
            <strong>From:</strong> {transaction.from_account_username}
          </p>
          <p className="text-base">
            <strong>Date:</strong> {formatDateTime(transaction.paid_on)}
          </p>
          <p className="text-base">
            <strong>Amount:</strong> {formatAmount(transaction.amount)}
          </p>
          <p className="text-base break-words" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
            <strong>Description:</strong> {transaction.description || 'No description available'}
          </p>
        </div>

        {/* Footer with Close button */}
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDetailSheet;