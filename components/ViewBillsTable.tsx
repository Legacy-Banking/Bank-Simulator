"use client"

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatAmount, formatDateTime } from "@/lib/utils"
import StatusLabel from './StatusLabel';
import BillSheet from './BillsDetailSheet';


// ViewBillsTable component
export const ViewBillsTable = ({ bills = [] }: BillProps) => {
  const [selectedBill, setBill] = useState<Bill | null>(null);

  const openBillDetails = (bills: Bill) => {
    setBill(bills);
  };

  const closeBillDetails = () => {
    setBill(null);
  };

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
          {bills.map((t: Bill) => {
            const amount = t.amount;

            return (
              <TableRow
                key={t.id}
                className={`!over:bg-none !border-b-DEFAULT cursor-pointer border-b-2 border-gray-100 bg-white-200`}
                onClick={() => openBillDetails(t)} // Open the sheet on row click
              >
                <TableCell className="max-w-[150px] pl-8">
                  <div className="flex items-center">
                    <h1 className="text-14 truncate font-semibold text-[#344054]">
                      {t.from}
                    </h1>
                  </div>
                </TableCell>

                <TableCell
                  className={`pl-2 pr-10 font-semibold`}
                >
                  {formatAmount(amount)}
                </TableCell>

                <TableCell className="min-w-32 pl-2 text-gray-500">
                  {formatDateTime(t.due_date)}
                </TableCell>

                <TableCell className="pl-2 text-gray-500">
                  <StatusLabel status={t.status}></StatusLabel>
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
