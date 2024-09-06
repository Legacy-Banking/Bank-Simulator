"use client";

import React, { useEffect, useState } from 'react';
import HeaderBox from '@/components/HeaderBox';
import { ViewBillsTable } from '@/components/ViewBillsTable';
import { useAppSelector } from '@/app/store/hooks';
import { billAction } from '@/utils/billAction';

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
            billAction.fetchBillsbyUserId(user_id).then((data) => {
                setBills(data);
            }).catch((error) => {
                console.error('Error fetching bills:', error);
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
          billed_user: '1231231',
          from: "Spotify",
          description: "",
          amount: 50,
          paid_on: '2024-08-25T10:00:00Z',
          status: 'Pending',
        },
        {
          id: '2',
          billed_user: '1231231',
          from: "Youtube Music",
          description: "",
          amount: 50,
          paid_on: '2024-08-25T10:00:00Z',
          status: 'Pending',
        },
        {
          id: '3',
          billed_user: '1231231',
          from: "Soundcloud",
          description: "",
          amount: 150,
          paid_on: '2024-08-25T10:00:00Z',
          status: 'Pending',
        },
        {
          id: '4',
          billed_user: '1231231',
          from: "Steam",
          description: "",
          amount: 500,
          paid_on: '2024-08-25T10:00:00Z',
          status: 'Paid',
        },
        {
          id: '5',
          billed_user: '1231231',
          from: "Kindle",
          description: "",
          amount: 20,
          paid_on: '2024-08-25T10:00:00Z',
          status: 'Overdue',
        },
        {
          id: '6',
          billed_user: '1231231',
          from: "META",
          description: "",
          amount: 150,
          paid_on: '2024-08-25T10:00:00Z',
          status: 'Pending',
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
