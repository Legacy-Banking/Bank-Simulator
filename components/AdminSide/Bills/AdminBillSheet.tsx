import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import SheetDetails from '@/components/SheetDetails'; // Import the existing SheetDetails component
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { useAppSelector } from "@/app/store/hooks"; // Import for user data



// Define the props for the component
type AdminBillDetailProps = {
    bill: AdminBill | null;
    assignedUsers: { name: string; status: 'overdue' | 'pending' | 'paid' }[];
    onClose: () => void;
};

const AdminBillDetailSheet: React.FC<AdminBillDetailProps> = ({ bill, assignedUsers, onClose }) => {
    if (!bill) return null;

    const user = useAppSelector((state) => state.user);

    return (
        <Dialog open={!!bill} onOpenChange={onClose}>
            <DialogContent className="bg-white-100 p-6 w-full max-w-4xl max-h-[88vh] overflow-auto shadow-lg">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold">Admin Bill Details</DialogTitle>
                    <DialogDescription className="text-base text-gray-500">
                        Detailed information about the selected bill.
                    </DialogDescription>
                </DialogHeader>

                {/* Bill details on the left */}
                <div className="flex flex-col lg:flex-row gap-4 mt-4">
                    <div className="lg:w-[60%]">
                        {/* Pass bill directly since `bill.bill` is not valid */}
                        <SheetDetails bill={bill} biller={{ name: bill.biller }}  // Construct a Partial<Biller> object with the name
                        />
                    </div>

                    {/* Assigned users and status on the right */}
                    <div className="lg:w-[50%] bg-white border border-gray-200 rounded-lg p-3">

                        <Table>
                            <TableHeader className="bg-blue-200">
                                <TableRow>
                                    <TableHead className="p-2 text-white-200 text-center rounded-tl-2xl">Assigned Users</TableHead>
                                    <TableHead className="p-2 text-white-200 text-center rounded-tr-2xl">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {assignedUsers.map((user, index) => (
                                    <TableRow key={index} className="bg-white rounded-lg shadow-sm mb-2">
                                        <TableCell className="p-2">
                                            <div className="flex items-center">
                                                <span className="inline-block w-8 h-8 rounded-full bg-gray-200 mr-2"></span>
                                                {user.name}
                                            </div>
                                        </TableCell>
                                        <TableCell className="p-2">
                                            <span
                                                className={`px-2 py-1 text-sm font-medium rounded-lg ${getStatusClass(user.status)}`}
                                            >
                                                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <DialogFooter className="w-full flex justify-center items-center mt-2">
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// Helper function to add status-based styles
const getStatusClass = (status: 'overdue' | 'pending' | 'paid') => {
    switch (status) {
        case 'overdue':
            return 'bg-red-100 text-red-800';
        case 'pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'paid':
            return 'bg-green-100 text-green-800';
        default:
            return '';
    }
};

export default AdminBillDetailSheet;
