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
      <DialogContent className="bg-white-100 p-6 max-w-lg w-full max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Bill Details</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Detailed information about the selected bill.
          </DialogDescription>
        </DialogHeader>
        <SheetDetails {...bills} />
        <DialogFooter className="w-full flex justify-center items-center">
          <Button onClick={onClose} className="text-sm bg-slate-200 w-32 m-auto">Print Bill</Button> {/*PRINT button needs to be implemented*/}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BillSheet;
