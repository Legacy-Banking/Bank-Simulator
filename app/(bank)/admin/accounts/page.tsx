import React from 'react'
import SearchBar from '@/components/SearchBar'
const Accounts = () => {
  return (
    <div className='px-8 py-6 flex flex-col flex-auto'>
      <div className='px-8 py-2 border-b-2 border-[#D7D7D7]'>
        <h1 className='text-3xl font-semibold leading-9'>Admin Dashboard</h1>
        <h1 className='text-base font-normal py-3 text-[#475467]'>View all account summaries</h1>
      </div>
      <div className='h-8'></div>
      <div className='px-8 py-2'>
        <div className='flex'>
          <div className='flex flex-1'>
            <h1 className="text-xl text-black font-semibold">Accounts</h1>
          </div>
          <SearchBar></SearchBar>

        </div>

        <div className='border-2 border-black mt-6'> Table</div>

      </div>
    </div>
    
  )
}

export default Accounts