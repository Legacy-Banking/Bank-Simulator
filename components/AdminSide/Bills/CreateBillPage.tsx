import React, { useState } from 'react';
import HeaderBox from '@/components/HeaderBox';
import AdminBillsTable from './AdminBillsTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react'
import CreateBillForm from './CreateBillForm';

const CreateBillPage = () => {

  const [isCreatingBill, setIsCreatingBill] = useState(false); // State to track if "Add Bill" button is clicked

  // Handle Add Bill Button Click
  const handleAddBillClick = () => {
    setIsCreatingBill(true); // Switch to the Create Bill form
  };

  return (
    <section className="flex w-full flex-row max-xl:max-h-screen font-inter">
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
          <CreateBillForm setIsCreatingBill={setIsCreatingBill} /> // Replace this with your actual form component
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
            <AdminBillsTable />
          </>
        )}
      </div>
    </section>
  )
}

export default CreateBillPage