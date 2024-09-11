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
import TransactionDetailSheet from './TransactionDetailSheet'; // Import the sheet component
import { cn, formatAmount, formatDateTime } from "@/lib/utils";

// TransactionsTable component
export const TransactionsTable = ({ transactions = [] }: TransactionTableProps) => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const openTransactionDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  const closeTransactionDetails = () => {
    setSelectedTransaction(null);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="bg-blue-200 text-white-200">
            <TableHead className="px-8 rounded-tl-2xl">Transaction</TableHead>
            <TableHead className="px-2">Date</TableHead>
            <TableHead className="px-2 rounded-tr-2xl">Amount</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {transactions.map((t: Transaction) => {
            const amount = t.amount;
            const isPositive = amount > 0;
            const isSignificantChange = Math.abs(amount) > 50; // Check if the change is more than $50

            return (
              <TableRow
                key={t.id}
                className={`${isSignificantChange
                  ? amount < 0
                    ? 'bg-red-150'
                    : 'bg-green-50'
                  : ''
                  } !over:bg-none !border-b-DEFAULT cursor-pointer`}
                onClick={() => openTransactionDetails(t)} // Open the sheet on row click
              >
                <TableCell className="max-w-[250px] pl-8 pr-10">
                  <div className="flex items-center gap-3">
                    <h1 className="text-14 truncate font-semibold text-[#344054]">
                      {/* Show from_account for positive amounts, and to_account or to_biller based on whether to_account is null */}
                      {isPositive ? (
                        `Account ${t.from_account}`  // Show the "from" account for positive amounts
                      ) : (
                        t.to_account ? (
                          `Account ${t.to_account}`  // Show the "to" account if it's not null
                        ) : (
                          `Biller ${t.to_biller}`  // Show the "to_biller" if to_account is null
                        )
                      )}
                    </h1>
                  </div>
                </TableCell>

                <TableCell className="min-w-32 pl-2 pr-10">
                  {formatDateTime(t.paid_on)}
                </TableCell>

                <TableCell
                  className={`pl-2 pr-10 font-semibold ${isPositive
                    ? 'text-green-100'
                    : 'text-red-200'

                    }`}
                >
                  {isPositive ? `+${formatAmount(amount)}` : `-${formatAmount(Math.abs(amount))}`}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <TransactionDetailSheet
        transaction={selectedTransaction}
        onClose={closeTransactionDetails}
      />
    </>
  );
};
