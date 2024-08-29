

import React from 'react'
import HeaderBox from '@/components/HeaderBox'
import Link from 'next/link';
import BalanceBox from '@/components/BalanceBox';
import { TransactionsTable } from '@/components/TransactionsTable';

const TransactionHistory = () => {

  const account = {
    data1: {
      name: 'Personal Account',
      officialName: 'Karen\'s Personal Account',
      bsb: '123456',
      accNum: '123456789',
      balance: 475.50,
    },
    data2: {
      name: 'Saving Account',
      officialName: 'Karen\'s Saving Account',
      bsb: '654321',
      accNum: '987654321',
      balance: 2245.50,
    }
  };

    // Mock transaction data
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        name: 'Grocery Shopping',
        date: '2024-08-25T10:00:00Z',
        amount: -75.50,
        totalBalance: 1400.00,
        description: 'Debit Card',
      },
      {
        id: '2',
        name: 'Salary Credit',
        date: '2024-08-24T08:00:00Z',
        amount: 800.00,
        totalBalance: 1475.50,
        description: 'Direct Deposit',
      },
      {
        id: '3',
        name: 'Utility Bill Payment',
        date: '2024-08-22T18:30:00Z',
        amount: -150.00,
        totalBalance: 675.50,
        description: 'BPAY',
      },
      {
        id: '4',
        name: 'Coffee Shop',
        date: '2024-08-20T09:15:00Z',
        amount: -4.50,
        totalBalance: 825.50,
        description: 'Credit Card',
      },
    ];


  return (
    <section className="flex w-full flex-row max-xl:max-h-screen max-xl:overflow-y-scroll font-inter">
      <div className="flex w-full flex-1 flex-col gap-8 px-5 sm:px-8 py-6 lg:py-12 lg:px-20 xl:px-40 2xl:px-72 xl:max-h-screen xl:overflow-y-scroll">
                                                                                   
        <header className="home-header">
          <HeaderBox 
            type="title"
            title="Transaction History"
            subtext="View and or Download all of your recent transactions"
          />
        </header>

      {/* Personal Account */}
      <div className="space-y-6">
          <div className="flex flex-col justify-between gap-4 rounded-lg border-y bg-yellow-gradient px-6 py-6 md:flex-row shadow-md">
            <div className="flex flex-col gap-2">
                  <h2 className="text-24 lg:text-26 font-bold text-blackText-50 hover:underline hover:text-white-100">
                    {account?.data1.name}
                  </h2>
              <p className="text-14 text-blackText-100">
                {account?.data1.officialName}
              </p>
              <p className="text-14 font-medium tracking-[1.1px] text-blackText-100">
                BSB: {account?.data1.bsb} <span className="mx-4"> </span> Account Number: {account?.data1.accNum}
              </p>
            </div>
            
            <div className='flex-center flex-col gap-2 rounded-md bg-white-100/20 px-8 py-2 text-blackText-100 border border-black'>
              <div className="text-24 text-center font-bold">          
                <BalanceBox 
                  accounts={[]}
                  currentBalance={account.data1.balance}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="">
          <h2 className="py-2 text-18 font-semibold text-gray-900">
            Recent Transactions
          </h2>
          {/* <p className="t ext-16 font-normal text-gray-600">
            Enter the bank account details of the recipient
          </p> */}
        </div>

        <section className="flex w-full flex-col gap-6">
        <TransactionsTable transactions={mockTransactions} />
          
            {/* {totalPages > 1 && (
              <div className="my-4 w-full">
                <Pagination totalPages={totalPages} page={currentPage} />
              </div>
            )} */}
        </section>

      </div>
    </section>
    
  )
}

export default TransactionHistory