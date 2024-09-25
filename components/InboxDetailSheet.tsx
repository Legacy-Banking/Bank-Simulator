import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { formatDateTime } from "@/lib/utils";
import { useRouter } from 'next/navigation';

type InboxDetailSheetProps = {
    message: Message | null;
    onClose: () => void;
}

const InboxDetailSheet: React.FC<InboxDetailSheetProps> = ({ message, onClose }) => {
    const router = useRouter();

    if (!message) return null;

    // This function will redirect to the corresponding bill's invoice number
    const handleViewBill = () => {
        if (message.bill_id) {
            // Redirect to /view-bills with the corresponding bill's invoice number
            router.push(`/view-bills?invoice_id=${message.bill_id}`);
        }
    };

    const handlePayNow = () => {
        router.push('/bpay');
    };

    return (
        <Dialog open={!!message} onOpenChange={onClose}>
            <DialogContent className="bg-white-200">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Message Details</DialogTitle>
                </DialogHeader>

                {/* Divider above the name */}
                <div className="h-0.5 bg-blue-200 my-2"></div>

                <div>
                    <p><strong>Name:</strong> {message.sender_name}</p>
                    {/* Blank space between name and date */}
                    <div className="my-2"></div>
                    <p><strong>Date:</strong> {formatDateTime(message.date_received)}</p>
                    {/* Blank space between date and description */}
                    <div className="my-2"></div>
                    <p><strong>Description:</strong> {message.description || 'No description available'}</p>
                </div>

                {/* Divider below message details */}
                <div className="h-0.5 bg-blue-200 my-2"></div>

                <DialogFooter className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row justify-between">
                    {message.type === 'bill' ? (
                        <>
                            <Button onClick={handleViewBill} className="bg-blue-200 text-white-200">
                                View Bill
                            </Button>
                            <Button onClick={handlePayNow} className="bg-blue-200 text-white-200">
                                Pay Now
                            </Button>
                            <Button onClick={onClose} className="bg-gray-200">
                                Close
                            </Button>
                        </>
                    ) : (
                        <Button onClick={onClose} className="bg-gray-200">
                            Close
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default InboxDetailSheet;
