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
import StatusLabel from '@/components/StatusLabel';
import { billAction } from '@/lib/actions/billAction';
import { Switch } from "@/components/ui/switch";

// Define the props for the component
type AdminBillDetailProps = {
    bill: AdminBillWithBiller | null;
    onClose: () => void;
    onPresetStatusChange: (billId: string, newStatus: boolean) => void;
};

const AdminBillDetailSheet: React.FC<AdminBillDetailProps> = ({ bill, onClose, onPresetStatusChange }) => {
    if (!bill) return null;
    const [loading, setLoading] = useState(true);
    const [assignedUsersDetails, setAssignedUsersDetails] = useState<{ name: string, status: string }[]>([]);
    const [presetStatus, setPresetStatus] = useState<boolean>(bill.preset_status);

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


    // Handle change for the switch
    const handlePresetStatusChange = async (checked: boolean) => {
        try {
            setPresetStatus(checked); // Update the local state
            await billAction.updatePresetStatus(bill.id, checked); // Call the action to update the preset status
            onPresetStatusChange(bill.id, checked); // Update the parent component's state
        } catch (error) {
            console.error('Failed to update preset status:', error);
        }
    };

    return (
        <Dialog open={!!bill} onOpenChange={onClose}>
            <DialogContent data-testid="admin-bill-details-dialog" className="bg-white-100 p-6 w-full max-w-4xl max-h-[88vh] overflow-auto shadow-lg">
                <DialogHeader>
                    <DialogTitle data-testid="dialog-title" className="text-2xl font-semibold">Admin Bill Details</DialogTitle>
                    <DialogDescription data-testid="dialog-description" className="text-base text-gray-500">
                        Detailed information about the selected bill.
                    </DialogDescription>
                </DialogHeader>

                <div className="absolute top-8 right-8 flex items-center mt-4">
                            <span className="mr-2 text-sm font-medium">Preset Status:</span>
                            <Switch
                                data-testid="preset-status-switch"
                                checked={presetStatus}
                                onCheckedChange={handlePresetStatusChange}
                                className={`ml-2 ${presetStatus ? 'bg-blue-200' : 'bg-gray-300'}`}
                            />
                        </div>

                {/* Bill details on the left */}
                <div className="flex flex-col lg:flex-row gap-4 mt-4">
                    <div data-testid="bill-details-section" className="lg:w-[60%]">
                        <SheetDetails bill={bill} biller={bill.biller}/>
                    </div>

                    {/* Assigned users and status on the right */}
                    <div className="lg:w-[50%] bg-white border border-gray-200 rounded-lg p-3 max-h-[540px] overflow-y-auto">

                        <Table data-testid="assigned-users-table">
                            <TableHeader className="bg-blue-200">
                                <TableRow>
                                    <TableHead className="p-2 text-base text-white-200 text-center rounded-tl-2xl">Assigned Users</TableHead>
                                    <TableHead className="p-2 text-base text-white-200 text-center rounded-tr-2xl">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={2} data-testid="assigned-users-message" className="text-center p-4">
                                            Loading assigned users...
                                        </TableCell>
                                    </TableRow>
                                ) : assignedUsersDetails.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={2} data-testid="assigned-users-message" className="text-center p-4">
                                            No users assigned.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    assignedUsersDetails.map((user, index) => (
                                        <TableRow key={index} data-testid="assigned-user-row" className="bg-white rounded-lg shadow-sm mb-2">
                                            <TableCell className="p-3">
                                                <div className="flex text-sm items-center">
                                                    {user.name}
                                                </div>
                                            </TableCell>
                                            <TableCell className="p-2 text-center">
                                                <StatusLabel status={user.status !== 'Unknown' && user.status ? user.status : 'unpaid'} />
                                            </TableCell>
                                        </TableRow>
                                    ))
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
