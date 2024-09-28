import React from 'react'
import HeaderBox from '@/components/HeaderBox';
import AdminBillsTable from './AdminBillsTable';

const CreateBillPage = () => {
  return (
    <section className="flex w-full flex-row max-xl:max-h-screen font-inter">
    <div className='flex w-full flex-1 flex-col gap-8 px-4 py-6 lg:py-12 lg:px-10 xl:px-20 2xl:px-32 xl:max-h-screen'>
        <header className="home-header border-b mb-4 pb-10">
          <HeaderBox
            type="title"
            title="Admin Bills"
            subtext="View all existing bills and assign bills to users"
          />
        </header>

    <AdminBillsTable/>
    </div>
    </section>
  )
}

export default CreateBillPage