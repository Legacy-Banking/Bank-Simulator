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
import { cn, formatDateTime } from "@/lib/utils"

type InboxDetailSheetProps = {
    message: Message | null;
    onClose: () => void;
}

const InboxDetailSheet: React.FC<InboxDetailSheetProps> = ({ message, onClose}) => {
    if (!message)
        return null;
    return (
        <Dialog open={!!message} onOpenChange={onClose}>
          <DialogContent className="bg-white-100">
            <DialogHeader>
              <DialogTitle>Message Details</DialogTitle>
              <DialogDescription>
                Detailed information about the selected message.
              </DialogDescription>
            </DialogHeader>
            <div >
              <p><strong>Name:</strong> {message.from_account}</p>
              <p><strong>Date:</strong> {formatDateTime(message.date_received)}</p>
              <p><strong>Description:</strong> {message.description || 'No description available'}</p>
            </div>
            <DialogFooter>
              <Button onClick={onClose}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
};

export default InboxDetailSheet;