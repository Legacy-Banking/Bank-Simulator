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
type BillSheetProps = {
  bills: Bill | null;
  onClose: () => void;
};

const BillSheet: React.FC<BillSheetProps> = ({ bills, onClose }) => {
  if (!bills) return null;

  return (
    <Dialog open={!!bills} onOpenChange={onClose}>
      <DialogContent className="bg-white-100">
        <DialogHeader>
          <DialogTitle>Bill Details</DialogTitle>
          <DialogDescription>
            Detailed information about the selected bill.
          </DialogDescription>
        </DialogHeader>
        <div >
          <p><strong>Name:</strong> {bills.name}</p>
          <p><strong>Date:</strong> {formatDateTime(bills.date)}</p>
          <p><strong>Amount:</strong> {formatAmount(bills.amount)}</p>
          <p><strong>Description:</strong> {bills.description || 'No description available'}</p>
        </div>
        <DialogFooter>
          <Button onClick={onClose} className="bg-slate-100">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BillSheet;
