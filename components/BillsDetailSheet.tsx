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
import SheetDetails from './SheetDetails';

// Define the props type for the component
type BillSheetProps = {
  bills: BillDetails | null;
  onClose: () => void;
};

const BillSheet: React.FC<BillSheetProps> = ({ bills, onClose }) => {
  if (!bills) return null;

  return (
    <Dialog open={!!bills} onOpenChange={onClose}>
      <DialogContent className="bg-white-100 w-max">
        <DialogHeader>
          <DialogTitle>Bill Details</DialogTitle>
          <DialogDescription>
            Detailed information about the selected bill.
          </DialogDescription>
        </DialogHeader>
        <SheetDetails {...bills} />
        <DialogFooter>
          <Button onClick={onClose} className="bg-slate-100">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BillSheet;
