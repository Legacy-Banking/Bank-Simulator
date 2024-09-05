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
      <DialogContent className="bg-white-100">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>
            Detailed information about the selected transaction.
          </DialogDescription>
        </DialogHeader>
        <div >
          <p><strong>Name:</strong> {transaction.name}</p>
          <p><strong>Date:</strong> {formatDateTime(transaction.date)}</p>
          <p><strong>Amount:</strong> {formatAmount(transaction.amount)}</p>
          <p><strong>Total Balance:</strong> {formatAmount(transaction.totalBalance)}</p>
          <p><strong>Description:</strong> {transaction.description || 'No description available'}</p>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDetailSheet;
