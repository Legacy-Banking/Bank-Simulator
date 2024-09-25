"use client";

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatAmount, formatDateTime } from "@/lib/utils";
import StatusLabel from './StatusLabel';
import BillSheet from './BillsDetailSheet';
import { useRouter, useSearchParams } from 'next/navigation';

export const ViewBillsTable = ({ bills = [] }: BillProps) => {
  const [selectedBill, setBill] = useState<BillDetails | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Function to open bill details and update the URL with invoice_id
  const openBillDetails = (bill: BillDetails) => {
    setBill(bill);
    router.push(`/view-bills?invoice_id=${bill.bill.invoice_number}`);
  };

  // Function to close the bill details popup
  const closeBillDetails = () => {
    setBill(null);
    router.push(`/view-bills`); // Remove the invoice_id query parameter when closing
  };

  // Automatically open the bill if the invoice_id is in the query parameters
  useEffect(() => {
    const invoiceId = searchParams.get('invoice_id');
    if (invoiceId) {
      const foundBill = bills.find((bill) => bill.bill.invoice_number === invoiceId);
      if (foundBill) {
        setBill(foundBill);
      }
    }
  }, [bills, searchParams]);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="bg-blue-200 text-white-200">
            <TableHead className="px-8 rounded-tl-2xl">Biller</TableHead>
            <TableHead className="px-2">Amount</TableHead>
            <TableHead className="px-2">Date Due</TableHead>
            <TableHead className="px-4 rounded-tr-2xl">Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {bills.map((t: BillDetails) => {
            const amount = t.bill.amount;

            return (
              <TableRow
                key={t.bill.id}
                className={`!over:bg-none !border-b-DEFAULT cursor-pointer border-b-2 border-gray-100 bg-white-200`}
                onClick={() => openBillDetails(t)} // Open the sheet on row click and update the URL
              >
                <TableCell className="max-w-[150px] pl-8">
                  <div className="flex items-center">
                    <h1 className="text-14 truncate font-semibold text-[#344054]">
                      {t.bill.from}
                    </h1>
                  </div>
                </TableCell>

                <TableCell className={`pl-2 pr-10 font-semibold`}>
                  {formatAmount(amount!)}
                </TableCell>

                <TableCell className="min-w-32 pl-2 text-gray-500">
                  {formatDateTime(t.bill.due_date!)}
                </TableCell>

                <TableCell className="pl-2 text-gray-500">
                  <StatusLabel status={t.bill.status!}></StatusLabel>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <BillSheet
        bills={selectedBill}
        onClose={closeBillDetails}
      />
    </>
  );
};
