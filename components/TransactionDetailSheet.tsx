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
import { cn, formatAmount, formatDateTime } from "@/lib/utils"

// Define the props type for the component
type TransactionDetailSheetProps = {
  transaction: Transaction | null;
  onClose: () => void;
};

const TransactionDetailSheet: React.FC<TransactionDetailSheetProps> = ({ transaction, onClose }) => {
  if (!transaction) return null;

  return (
    <Dialog open={!!transaction} onOpenChange={onClose}>
      <DialogContent className="bg-white-100 p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Transaction Details</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Detailed information about the selected transaction.
          </DialogDescription>
        </DialogHeader>

        {/* Transaction details */}
        <div className="space-y-4">
          <p className="text-sm">
          <strong>To:</strong> {transaction.to_account ? `Account ${transaction.to_account}` : `Biller ${transaction.to_biller}`}
          </p>
          <p className="text-sm">
            <strong>From:</strong> Account {transaction.from_account}
          </p>
          <p className="text-sm">
            <strong>Date:</strong> {formatDateTime(transaction.paid_on)}
          </p>
          <p className="text-sm">
            <strong>Amount:</strong> {formatAmount(transaction.amount)}
          </p>
          <p
            className="text-sm break-words"
            style={{
              wordBreak: 'break-word', // Ensures long words break into the next line
              overflowWrap: 'break-word', // Alternative support for breaking long words
            }}
          >
            <strong>Description:</strong>{' '}
            {transaction.description || 'No description available'}
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
