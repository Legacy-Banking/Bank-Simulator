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
type AccountDetailSheetProps = {
  account: Account | null;
  onClose: () => void;
  deleteAccount: () => void;
};

const TrashAccountDetailSheet: React.FC<AccountDetailSheetProps> = ({ account, onClose, deleteAccount }) => {
  if (!account) return null;

  return (
    <Dialog open={!!account} onOpenChange={onClose}>
      <DialogContent className="bg-white-100 p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Confirm Delete</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Detailed information about the selected transaction.
          </DialogDescription>
        </DialogHeader>

        {/* Transaction details */}
        <div className="space-y-4">
          Text here
        </div>

        {/* Footer with Close button */}
        <DialogFooter>
            <Button onClick={onClose}>Cancel</Button>
          <Button onClick={deleteAccount}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TrashAccountDetailSheet;
