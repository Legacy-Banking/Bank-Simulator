"use client";

import React, { useEffect, useState } from 'react';
import HeaderBox from '@/components/HeaderBox';
import { ViewBillsTable } from '@/components/ViewBillsTable';
import { useAppSelector } from '@/store/hooks';
import { billAction } from '@/lib/actions/billAction';

// Define the Transaction type

const ViewBills = () => {
  const [loading, setLoading] = useState(true);
  const user_id = useAppSelector((state) => state.user.user_id)?.toString();
  const [bills, setBills] = useState<BillDetails[]>([]);
  useEffect(() => {
    if (user_id) {
      billAction.fetchBillDetails(user_id).then((data) => {
        setBills(data);
      }).catch((error) => {
        console.error('Error fetching bills:', error);
      })
        .finally(() => {
          setLoading(false); // Set loading to false when data is fetched
        });
    }
  }, [user_id]);

  return (
    <section className="flex w-full flex-row max-xl:max-h-screen max-xl:overflow-y-scroll font-inter">
      <div className="flex w-full flex-1 flex-col gap-8 px-5 sm:px-8 py-6 lg:py-12 lg:px-20 xl:px-40 2xl:px-72 xl:max-h-screen xl:overflow-y-scroll">
        {loading ? (
          // Show spinner while loading
          <div className="flex items-center justify-center">
            <div className="spinner"></div> {/* Replace with your actual spinner component */}
          </div>
        ) : (
          <>
            <header className="home-header">
              <HeaderBox
                type="title"
                title="Bills"
                subtext="View upcoming and paid bills"
              />
            </header>

            {/* Transaction History Table */}
            <section className="flex w-full flex-col gap-6">
              <ViewBillsTable bills={bills} />
            </section>
          </>
        )}
      </div>
    </section>
  );
}

export default ViewBills;
