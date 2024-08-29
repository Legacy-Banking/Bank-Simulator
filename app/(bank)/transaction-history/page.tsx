"use client";

import React, { useState } from 'react';
import HeaderBox from '@/components/HeaderBox';
import BalanceBox from '@/components/BalanceBox';
import { TransactionsTable } from '@/components/TransactionsTable';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select'; 
import { Button } from '@/components/ui/button';

// Define the Transaction type
type Transaction = {
  id: string;
  name: string;
  date: string | Date;
  amount: number;
  totalBalance: number;
  description?: string;
};

const TransactionHistory = () => {
  const [selectedAccount, setSelectedAccount] = useState<'data1' | 'data2'>('data1');

  const account = {
    data1: {
      name: 'Personal Account',
      officialName: "Karen's Personal Account",
      bsb: '123456',
      accNum: '123456789',
      balance: 475.50,
      transactions: [
        {
          id: '1',
          name: 'Grocery Shopping',
          date: '2024-08-25T10:00:00Z',
          amount: -75.50,
          totalBalance: 400.00,
          description: 'Debit Card',
        },
        {
          id: '2',
          name: 'Salary Credit',
          date: '2024-08-24T08:00:00Z',
          amount: 800.00,
          totalBalance: 475.50,
          description: 'Direct Deposit',
        },
        {
          id: '3',
          name: 'Utility Bill Payment',
          date: '2024-08-22T18:30:00Z',
          amount: -150.00,
          totalBalance: 325.50,
          description: 'BPAY',
        },
        {
          id: '4',
          name: 'Coffee Shop',
          date: '2024-08-20T09:15:00Z',
          amount: -4.50,
          totalBalance: 329.50,
          description: 'Credit Card',
        },
        {
          id: '5',
          name: 'Dinner at Restaurant',
          date: '2024-08-18T19:00:00Z',
          amount: -60.00,
          totalBalance: 389.50,
          description: 'Debit Card',
        },
        {
          id: '6',
          name: 'Online Shopping',
          date: '2024-08-17T15:45:00Z',
          amount: -120.00,
          totalBalance: 509.50,
          description: 'Credit Card',
        },
        {
          id: '7',
          name: 'Friend',
          date: '2024-08-13T12:00:00Z',
          amount: 40.00,
          totalBalance: 629.50,
          description: 'Online Transfer',
        },
      ],
    },
    data2: {
      name: 'Savings Account',
      officialName: "Karen's Savings Account",
      bsb: '654321',
      accNum: '987654321',
      balance: 2245.50,
      transactions: [
        {
          id: '8',
          name: 'Interest Credit',
          date: '2024-08-24T00:00:00Z',
          amount: 20.00,
          totalBalance: 2245.50,
          description: 'Interest',
        },
        {
          id: '9',
          name: 'Utility Bill Payment',
          date: '2024-08-22T18:30:00Z',
          amount: -150.00,
          totalBalance: 2225.50,
          description: 'BPAY',
        },
        {
          id: '10',
          name: 'Deposit from Personal Account',
          date: '2024-08-20T10:00:00Z',
          amount: 200.00,
          totalBalance: 2245.50,
          description: 'Direct Deposit',
        },
        {
          id: '11',
          name: 'Vacation Fund Transfer',
          date: '2024-08-18T08:00:00Z',
          amount: -300.00,
          totalBalance: 2045.50,
          description: 'Online Transfer',
        },
        {
          id: '12',
          name: 'Bonus Credit',
          date: '2024-08-15T09:00:00Z',
          amount: 150.00,
          totalBalance: 2345.50,
          description: 'Direct Deposit',
        },
      ],
    },
  };
  

  const handleAccountChange = (value: 'data1' | 'data2') => {
    setSelectedAccount(value);
  };

  const handleDownloadStatement = () => {
    // Logic to download the statement goes here
    console.log('Downloading statement for', account[selectedAccount].name);
  };

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

        {/* Account Select Dropdown */}
        <div className="flex justify-end">
          <Select onValueChange={handleAccountChange} defaultValue="data1">
            <SelectTrigger className="w-48">
              <span>{account[selectedAccount].name}</span>
            </SelectTrigger>
            <SelectContent className="bg-white-200">
              <SelectItem value="data1">Personal Account</SelectItem>
              <SelectItem value="data2">Savings Account</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Selected Account Information */}
        <div className="space-y-6">
          <div className="flex flex-col justify-between gap-4 rounded-lg border-y bg-yellow-gradient px-6 py-6 md:flex-row shadow-md">
            <div className="flex flex-col gap-2">
              <h2 className="text-24 lg:text-26 font-bold text-blackText-50 hover:underline hover:text-white-100">
                {account[selectedAccount].name}
              </h2>
              <p className="text-14 text-blackText-100">
                {account[selectedAccount].officialName}
              </p>
              <p className="text-14 font-medium tracking-[1.1px] text-blackText-100">
                BSB: {account[selectedAccount].bsb} <span className="mx-4"> </span> Account Number: {account[selectedAccount].accNum}
              </p>
            </div>
            
            <div className='flex-center flex-col gap-2 rounded-md bg-white-100/20 px-8 py-2 text-blackText-100 border border-black'>
              <div className="text-24 text-center font-bold">          
                <BalanceBox 
                  accounts={[]}
                  currentBalance={account[selectedAccount].balance}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions Title and Download Button */}
        <div className="flex justify-between items-center">
          <h2 className="py-2 text-18 font-semibold text-gray-900">
            Recent Transactions
          </h2>
          <Button onClick={handleDownloadStatement} className="ml-auto border border-gray-500 px-8">
            Download Statement
          </Button>
        </div>

        {/* Transaction History Table */}
        <section className="flex w-full flex-col gap-6">
          <TransactionsTable transactions={account[selectedAccount].transactions} />
        </section>

      </div>
    </section>
  );
}

export default TransactionHistory;
