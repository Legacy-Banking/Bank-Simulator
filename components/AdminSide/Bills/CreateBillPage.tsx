import React, { useEffect, useState } from 'react';
import { billAction } from '@/lib/actions/billAction';
import HeaderBox from '@/components/HeaderBox';
import AdminBillsTable from './AdminBillsTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react'
import CreateBillForm from './CreateBillForm';
import { Pagination } from '@/components/Pagination';

const CreateBillPage = () => {
  const [bills, setBills] = useState<AdminBillWithBiller[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreatingBill, setIsCreatingBill] = useState(false); // State to track if "Add Bill" button is clicked
  const [page, setPage] = useState(1);
  const [deleteBillId, setDeleteBillId] = useState<string | null>(null);

  // Function to fetch bills
  const fetchBills = async () => {
    try {
      const data = await billAction.fetchAdminBills();
      setBills(data);
    } catch (error) {
      console.error('Failed to fetch bills:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();

    // Access query parameters after component mounts
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const pageParam = params.get('page');
      if (pageParam) {
        setPage(parseInt(pageParam));
      }
    }
  }, []);

  const updateBillPresetStatus = (billId: string, newStatus: boolean) => {
    setBills((prevBills) =>
        prevBills.map((bill) =>
            bill.id === billId ? { ...bill, preset_status: newStatus } : bill
        )
    );
};

  // Function to fetch updated assigned users for a specific bill
  const fetchUpdatedAssignedUsers = async (billId: string) => {
    try {
      const updatedBill = await billAction.fetchAdminBillById(billId);
      setBills((prevBills) =>
        prevBills.map((bill) =>
          bill.id === billId ? { ...bill, assigned_users: updatedBill.assigned_users } : bill
        )
      );
    } catch (error) {
      console.error("Error fetching updated assigned users:", error);
    }
  };

  // Delete the bill and remove it from the state
  const handleDelete = async () => {
    if (deleteBillId) {
      try {
        //   await billAction.deleteAdminBill(deleteBillId); // Call the delete function
        await billAction.deleteAdminBillWithReferences(deleteBillId);

        setBills((prevBills) => prevBills.filter((bill) => bill.id !== deleteBillId));
      } catch (error) {
        console.error('Failed to delete bill:', error);
      }
    }
  };

  // Handle Add Bill Button Click
  const handleAddBillClick = () => {
    setIsCreatingBill(true); // Switch to the Create Bill form
  };

  const rowsPerPage = 10;
  // Filter bills based on pagination
  const totalPages = Math.ceil(bills.length / rowsPerPage);
  const indexOfLastBill = page * rowsPerPage;
  const indexOfFirstBill = indexOfLastBill - rowsPerPage;
  const currentBills = bills.slice(indexOfFirstBill, indexOfLastBill);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section 
    data-testid={'create-bill-page'}
    className="flex w-full flex-row max-xl:max-h-screen font-inter">
      <div className="flex w-full flex-1 flex-col gap-8 px-4 py-6 lg:py-12 lg:px-10 xl:px-20 2xl:px-32 xl:max-h-screen">
        <header className="home-header border-b pb-10">
          <HeaderBox
            type="title"
            title={isCreatingBill ? 'Create Bill' : 'Admin Bills'}
            subtext={isCreatingBill ? 'Create a new bill' : 'View all existing bills and assign bills to users'}
          />
        </header>

        {/* Conditionally Render Add Bills Button or AdminBillsTable */}
        {isCreatingBill ? (
          // Render Create Bill form if "Add Bill" is clicked
          <CreateBillForm setIsCreatingBill={setIsCreatingBill} fetchBills={fetchBills} /> // Replace this with your actual form component
        ) : (
          <>
            {/* Add Bills Button */}
            <div className="flex justify-end mb-4">
              <Button className="bg-blue-gradient text-white-200 flex items-center px-4 py-6 text-lg" onClick={handleAddBillClick}>
                <Plus className="inline h-6 w-6 mr-3" />
                <span className="mr-12">Add Bill</span>
              </Button>
            </div>

            {/* Render Admin Bills Table */}
            <AdminBillsTable
              bills={currentBills}
              onUpdatePresetStatus={updateBillPresetStatus}
              onFetchUpdatedAssignedUsers={fetchUpdatedAssignedUsers}
              onDeleteBill={handleDelete}
              setDeleteBillId={setDeleteBillId} // Pass function to set the delete bill ID
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pt-4 mb-2 px-5 w-full border-t-2">
                <Pagination totalPages={totalPages} page={page} setPage={setPage} />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

export default CreateBillPage