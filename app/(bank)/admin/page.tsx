import AdminSideBar from '@/components/AdminSideBar'
import React from 'react'

const AdminDashboard = () => {
  return (
    <div className="flex">
      <AdminSideBar/>
      <main className="bg-[#FCFCFD] flex flex-auto border-[#D7D7D7] border-x-2">
      </main>
    </div>
  )
}

export default AdminDashboard