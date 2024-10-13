"use client";

import React, { useEffect, useState } from 'react';
import HeaderBox from '@/components/HeaderBox';
import { ViewBillsTable } from '@/components/ViewBillsTable';
import { useAppSelector } from '@/store/hooks';
import { billAction } from '@/lib/actions/billAction';
import { Pagination } from '@/components/Pagination';
import { useSearchParams, useRouter } from 'next/navigation';

// Define the Transaction type

const ViewBills = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const user_id = useAppSelector((state) => state.user.user_id)?.toString();
  const [bills, setBills] = useState<BillDetails[]>([]);
  const pageFromUrl = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
  const [page, setPage] = useState(pageFromUrl);
  const rowsPerPage = 10;

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

  const totalPages = Math.ceil(bills.length / rowsPerPage);
  const indexOfLastBill = page * rowsPerPage;
  const indexOfFirstBill = indexOfLastBill - rowsPerPage;
  const currentBill = bills.slice(indexOfFirstBill, indexOfLastBill);

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
              <ViewBillsTable bills={currentBill} />
              {totalPages > 1 && (
                <div className="my-4 w-full pb-2">
                  <Pagination totalPages={totalPages} page={page} setPage={setPage} />
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </section>
  );
}

export default ViewBills;
