import React from 'react'
import HeaderBox from '@/components/HeaderBox';

const ViewBills = () => {
  return (
    <section className="flex w-full flex-row max-xl:max-h-screen max-xl:overflow-y-scroll font-inter">
      <div className="flex w-full flex-1 flex-col gap-8 px-5 sm:px-8 py-6 lg:py-12 lg:px-20 xl:px-40 2xl:px-72 xl:max-h-screen xl:overflow-y-scroll">
        <header className="home-header">
            <HeaderBox 
              type="title"
              title="Bills"
              subtext="View upcoming and paid bills"
            />
        </header>
      </div>
    </section>
  )
}

export default ViewBills