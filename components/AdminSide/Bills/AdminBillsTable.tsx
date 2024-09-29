import React, { useEffect, useState } from 'react';
import { billAction } from '@/utils/billAction'; // Assuming this is the path to billAction
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '@/components/ui/table'; 
import { Button } from '@/components/ui/button';
import { formatAmount } from "@/lib/utils";
import { ChevronUp, ChevronDown, ChevronsUpDown, Trash2Icon, UserPlus, UserMinus } from 'lucide-react';
import TrashBillDetailSheet from './TrashBillDetialSheet';
import AssignUserSheet from './AssignUserSheet';

const AdminBillsTable = () => {
    const [bills, setBills] = useState<AdminBillWithBiller []>([]);
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState<{ key: keyof AdminBill; direction: 'ascending' | 'descending' } | null>(null);
    const [deleteBillId, setDeleteBillId] = useState<string | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isAssignSheetOpen, setIsAssignSheetOpen] = useState(false);
    const [selectedBill, setSelectedBill] = useState<AdminBillWithBiller  | null>(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await billAction.fetchAdminBills();
          setBills(data);
        } catch (error) {
          console.error('Failed to fetch bills:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, []);
  
    // Delete the bill and remove it from the state
    const handleDelete = async () => {
        if (deleteBillId) {
            try {
              await billAction.deleteAdminBill(deleteBillId); // Call the delete function
              setBills((prevBills) => prevBills.filter((bill) => bill.id !== deleteBillId));
              setShowDeleteDialog(false); // Close the dialog after deleting
            } catch (error) {
              console.error('Failed to delete bill:', error);
            }
          }
      };

    const handleSort = (key: keyof AdminBill) => {
      let direction: 'ascending' | 'descending' = 'ascending';
      if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
        direction = 'descending';
      }
      setSortConfig({ key, direction });
    };
  
    const sortedBills = React.useMemo(() => {
      if (sortConfig !== null) {
        return [...bills].sort((a, b) => {
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
          return 0;
        });
      }
      return bills;
    }, [bills, sortConfig]);
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    const getSortIcon = (key: keyof AdminBill) => {
        if (sortConfig?.key === key) {
          return sortConfig.direction === 'ascending' ? (
            <ChevronUp className="inline h-4 w-4" strokeWidth={3} />
          ) : (
            <ChevronDown className="inline h-4 w-4" strokeWidth={3} />
          );
        }
        return <ChevronsUpDown className="inline h-4 w-4" strokeWidth={3} />; // Default icon
      };

    const columns = [
      { label: 'Biller', key: 'biller' as keyof AdminBill },
      { label: 'Amount', key: 'amount' as keyof AdminBill },
      { label: 'Due Date', key: 'due_date' as keyof AdminBill },
      { label: 'Action', key: null }, // actions won't be sorted
    ];

    const handleAssignUserClick = (bill: AdminBillWithBiller) => {
        setSelectedBill(bill); // Set the bill details for assignment
        setIsAssignSheetOpen(true); // Open the AssignUserSheet
      };
  
    return (
      <>
        <Table>
        <TableHeader>
          <TableRow className="bg-blue-200 text-white-200">
            <TableHead
              className="font-inter px-8 rounded-tl-2xl font-normal tracking-wider cursor-pointer"
              onClick={() => handleSort('biller')}
            >
              Biller
              <span className="ml-2">{getSortIcon('biller')}</span>
            </TableHead>
            <TableHead
              className="font-inter px-4 font-normal tracking-wider cursor-pointer"
              onClick={() => handleSort('amount')}
            >
              Amount
              <span className="ml-2">{getSortIcon('amount')}</span>
            </TableHead>
            <TableHead
              className="font-inter px-2 font-normal tracking-wider cursor-pointer"
              onClick={() => handleSort('due_date')}
            >
              Due Date
              <span className="ml-2">{getSortIcon('due_date')}</span>
            </TableHead>
            <TableHead className="font-inter px-8 rounded-tr-2xl font-normal tracking-wider">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sortedBills.map((bill: AdminBillWithBiller) => {
            const billerName = bill.biller.name;
            const amount = bill.amount;
            const dueDate = new Date(bill.due_date);

            return (
              <TableRow key={bill.id} className="border-b cursor-pointer" 
                // Admin Bill Sheet on click
                // onClick={() => openAdminBillsDetail(...)}
              >
                <TableCell className="max-w-[200px] pl-8 pr-10">
                  <div className="flex items-center gap-3">
                    <h1 className="font-inter text-sm truncate font-semibold text-[#344054]">
                      {billerName}
                    </h1>
                  </div>
                </TableCell>

                <TableCell className="font-inter font-semibold">
                  {formatAmount(amount)}
                </TableCell>

                <TableCell className="font-inter min-w-32 pl-2 pr-10 text-[#475467]">
                  {dueDate.toDateString()}
                </TableCell>

                <TableCell>
                <div className="flex flex-col lg:flex-row justify-start gap-6 px-4">
                  <Button className="bg-white-100 border border-gray-300 p-2"
                          onClick={() => handleAssignUserClick(bill)}
                          >
                            <UserPlus className="inline h-6 w-6" fill="#99e087"/>
                           </Button>
                  <Button className="bg-white-100 border border-gray-300 p-2">
                        <UserMinus className="inline h-6 w-6" fill="#F87171"/>
                        </Button>
                  <Button
                      className="bg-white-100 border border-gray-300 p-2"
                      onClick={() => {
                        setDeleteBillId(bill.id); // Set the bill ID to delete
                        setShowDeleteDialog(true); // Show the confirmation dialog
                      }}
                    >
                      <Trash2Icon className="inline h-6 w-6" fill="#F87171" stroke="black" strokeWidth={1} />
                    </Button>
                </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>

        </Table>

        {/* Add Admin Bills Sheet */}

        {/* Add Assign Bill Sheet */}
        {selectedBill && (
        <>
            {console.log("AssignUserSheet Props: ", {
            biller: selectedBill.biller,
            amount: selectedBill.amount,
            description: selectedBill.description || "",
            duedate: selectedBill.due_date
            })}
            <AssignUserSheet
            isOpen={isAssignSheetOpen}
            onClose={() => setIsAssignSheetOpen(false)}
            biller={selectedBill.biller} // Pass full biller object with name and biller_code
            amount={selectedBill.amount}
            description={selectedBill.description || ""}
            due_date={new Date(selectedBill.due_date)} 
            linkedBill={selectedBill.id}
            assignedUsers={selectedBill.assigned_users || ""}
            />
        </>
        )}


        {/* Add Unassign Bill Sheet */}

        {/* Delete Confirmation Dialog */}
        <TrashBillDetailSheet 
          status={showDeleteDialog} 
          onClose={() => setShowDeleteDialog(false)} 
          deleteBill={handleDelete} 
        />

      </>
    );
  };

export default AdminBillsTable;
