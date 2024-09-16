"use client";
import AccountsPage from '@/components/AdminSide/AccountsPage';
import AdditionalFundsPage from '@/components/AdminSide/AdditionalFundsPage';
import AdminSideBar from '@/components/AdminSide/AdminSideBar'
import CreateBillPage from '@/components/AdminSide/CreateBillPage';
import PresetsPage from '@/components/AdminSide/PresetsPage';
import React, { useState } from 'react'

const AdminDashboard = () => {

  const [activePage, setActivePage] = useState('accounts');


  const renderActivePage = () => {
    switch (activePage) {
      case 'accounts':
        return <AccountsPage />;
      case 'presets':
        return <PresetsPage />;
      case 'create-bill':
        return <CreateBillPage />;
      case 'additional-funds':
        return <AdditionalFundsPage />;
      default:
        return <AccountsPage />;
    }
  };

  return (
    <div className="flex">
      <AdminSideBar activePage={activePage} setActivePage={setActivePage}/>
      <main className="bg-[#FCFCFD] flex flex-auto border-[#D7D7D7] border-x-2">
        {renderActivePage()}
      </main>
    </div>
  )
}

export default AdminDashboard