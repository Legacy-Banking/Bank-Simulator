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
          <ViewBillsTable bills={bills} />
        </section>

      </div>
    </section>
  );
}

export default ViewBills;
