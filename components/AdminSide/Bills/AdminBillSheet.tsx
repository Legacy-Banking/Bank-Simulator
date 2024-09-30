import React, { useEffect, useState } from 'react'; import {
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
import StatusLabel from '@/components/StatusLabel';
import { billAction } from '@/utils/billAction'; // Assuming this is the path to billAction

// Define the props for the component
type AdminBillDetailProps = {
    bill: AdminBillWithBiller | null;
    onClose: () => void;
};

const AdminBillDetailSheet: React.FC<AdminBillDetailProps> = ({ bill, onClose }) => {
    if (!bill) return null;
    const [loading, setLoading] = useState(true);
    const [assignedUsersDetails, setAssignedUsersDetails] = useState<{ name: string, status: string }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (bill) {
                try {
                    const data = await billAction.fetchAssignedUsersStatus(bill);
                    console.log("Fetched Assigned User Details:", data); // Log fetched data here
                    setAssignedUsersDetails(data); // Correctly set the state
                } catch (error) {
                    console.error('Failed to fetch assigned users:', error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchData();
    }, [bill]); // Make sure "bill" is the only dependency


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
                        <SheetDetails bill={bill} biller={bill.biller}
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
                                {!loading && assignedUsersDetails.length > 0 ? (
                                    assignedUsersDetails.map((user, index) => (
                                        <TableRow key={index} className="bg-white rounded-lg shadow-sm mb-2">
                                            <TableCell className="p-2">
                                                <div className="flex items-center">
                                                    <span className="inline-block w-8 h-8 rounded-full bg-gray-200 mr-2"></span>
                                                    {user.name}
                                                </div>
                                            </TableCell>
                                            <TableCell className="p-2">
                                                <StatusLabel status={user.status !== 'Unknown' && user.status ? user.status : 'unpaid'} />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={2} className="text-center p-4">
                                            {loading ? 'Loading assigned users...' : 'No users assigned.'}
                                        </TableCell>
                                    </TableRow>
                                )}
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


export default AdminBillDetailSheet;
