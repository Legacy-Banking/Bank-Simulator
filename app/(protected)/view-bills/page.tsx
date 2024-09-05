"use client";

import React, { useEffect, useState } from 'react';
import HeaderBox from '@/components/HeaderBox';
import { ViewBillsTable } from '@/components/ViewBillsTable';
import { useAppSelector } from '@/app/store/hooks';
import { accountBill } from '@/utils/accountBill';

// Define the Transaction type
type Transaction = {
  id: string;
  name: string;
  date: string | Date;
  amount: number;
  totalBalance: number;
  description?: string;
};

const ViewBills = () => {

  const user_id = useAppSelector((state) => state.user.user_id)?.toString();
    const [bills, setBills] = useState<Bill[]>([]);
    useEffect(() => {
        if (user_id) {
            accountBill.fetchBillsbyUserId(user_id).then((data) => {
                setBills(data);
            }).catch((error) => {
                console.error('Error fetching accounts:', error);
            });
        }
    }, [user_id]);
  const [selectedAccount, setSelectedAccount] = useState<'data1' | 'data2'>('data1');

  const account = {
    data1: {
      name: 'Personal Account',
      officialName: "Karen's Personal Account",
      bsb: '123456',
      accNum: '123456789',
      balance: 475.50,
      bills: [
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
      bills: [
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
  


  return (
    <section className="flex w-full flex-row max-xl:max-h-screen max-xl:overflow-y-scroll font-inter bg-gray-50">
      <div className="flex w-full flex-1 flex-col gap-8 px-5 sm:px-8 py-6 lg:py-12 lg:px-20 xl:px-40 2xl:px-72 xl:max-h-screen xl:overflow-y-scroll">

        <header className="home-header">
          <HeaderBox 
            type="title"
            title="Bills"
            subtext="View upcoming and paid bills"
          />
        </header>

        {/* Bills Title */}
        <div className="flex justify-between items-center">
          <h2 className="py-2 text-18 font-semibold text-gray-900">
            Bills
          </h2>
        </div>

        {/* Transaction History Table */}
        <section className="flex w-full flex-col gap-6">
          {/* Working on this one  */}
          {/*   ============== */}
          {/*       |     |
                    |     |
                    V     V*/}
          {/* <ViewBillsTable bills={bills} /> */}  
          <ViewBillsTable bills={account.data1.bills}></ViewBillsTable>
        </section>

      </div>
    </section>
  );
}

export default ViewBills;
