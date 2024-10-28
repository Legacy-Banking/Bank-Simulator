import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { formatDateTime } from "@/lib/utils";
import { useRouter } from 'next/navigation';
import { inboxAction } from '@/lib/actions/inboxAction';

type InboxDetailSheetProps = {
    message: Message | null;
    onClose: () => void;
}

const InboxDetailSheet: React.FC<InboxDetailSheetProps> = ({ message, onClose }) => {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    // Reset state when the message changes or dialog is closed
    useEffect(() => {
        setShowConfirmDialog(false);
        setSuccessMessage('');
        setError('');
    }, [message, onClose]);

    if (!message) return null;

    // Handle Cancel Future Payments
    const handleCancelFuturePayments = () => {
        setShowConfirmDialog(true); // Open confirmation dialog
    };

    const handleConfirmCancel = async () => {
        try {
            await inboxAction.cancelSchedule(message); // Call action to cancel payments
            setShowConfirmDialog(false); // Close the confirmation dialog
            setSuccessMessage('Future payments have been successfully canceled.'); // Show success message
        } catch (err) {
            setError('Failed to cancel future payments. Please try again.'); // Handle error
        }
    };

    const handleCancelDialogClose = () => {
        setShowConfirmDialog(false); // Close the confirmation dialog without action
    };

    return (
        <Dialog open={!!message} onOpenChange={onClose}>
            <DialogContent className="bg-white-200 p-6">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold font-inter">Message Details</DialogTitle>
                </DialogHeader>

                <div className="h-0.5 bg-blue-200 my-2"></div>

                <div>
                    <p><strong>Name:</strong> {message.sender_name}</p>
                    <div className="my-2"></div>
                    <p><strong>Date:</strong> {formatDateTime(message.date_received)}</p>
                    <div className="my-2"></div>
                    <p><strong>Description:</strong> {message.description || 'No description available'}</p>
                </div>

                <div className="h-0.5 bg-blue-200 my-2"></div>

                <DialogFooter className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row justify-between">
                    {message.type === 'recurring' ? (
                        <>
                            <Button onClick={handleCancelFuturePayments} className="bg-blue-500 text-white-200">
                                Cancel Future Payments
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

                {/* Confirmation Dialog */}
                {showConfirmDialog && (
                    <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                        <DialogContent className="bg-white-100 p-6">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-semibold font-inter mb-10">Confirm Cancellation</DialogTitle>
                                <DialogDescription className="text-base font-inter text-[#191919] border-blue-25 border-y-2 py-4">
                                    Are you sure you want to cancel future payments? <br />
                                    This action cannot be undone.
                                </DialogDescription>
                            </DialogHeader>

                            {/* Error Message */}
                            {error && (
                                <div className="text-red-200">
                                    *<Button className="delete" onClick={() => setError('')}></Button>
                                    {error}
                                </div>
                            )}

                            <DialogFooter className="mt-8 flex">
                                <Button onClick={handleCancelDialogClose} className="grow uppercase font-inter border-2 border-gray-300 hover:bg-slate-200 tracking-wider text-gray-500">
                                    No
                                </Button>
                                <Button onClick={handleConfirmCancel} className="grow uppercase font-inter tracking-wider bg-red-500 hover:bg-red-600 text-white-100">
                                    Yes
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}

                {/* Success Message styled like the image */}
                {successMessage && (
                    <div className="mt-4 p-2 bg-green-500 text-white-100 rounded-md text-center">
                        {successMessage}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default InboxDetailSheet;
