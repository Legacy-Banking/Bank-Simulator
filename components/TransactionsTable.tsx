"use client"

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  // TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn_ui/table";
import TransactionDetailSheet from './TransactionDetailSheet'; // Import the sheet component
import { formatAmount, formatDateTime, capitalizeFirstLetter } from "@/lib/utils/utils";

// TransactionsTable component
export const TransactionsTable = ({ transactions = [] }: TransactionTableProps) => {
  const [selectedTransaction, setSelectedTransaction] = React.useState<Transaction | null>(null);

  const openTransactionDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  const closeTransactionDetails = () => {
    setSelectedTransaction(null);
  };

  const isSignificantChange = (amount: number): boolean => { // Explicitly define the type for amount
    return Math.abs(amount) > 50; // Customize this value based on what you consider significant
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="bg-blue-200 text-white-200">
            <TableHead className="text-lg px-8 rounded-tl-2xl">Transaction</TableHead>
            <TableHead className="text-lg px-2">Date</TableHead>
            <TableHead className="text-lg px-2 rounded-tr-2xl">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction: Transaction) => (
            <TableRow
              key={transaction.id}
              className={`cursor-pointer !border-b-DEFAULT ${isSignificantChange(transaction.amount) ? (transaction.amount > 0 ? 'bg-green-50' : 'bg-red-150') : ''}`}
              onClick={() => openTransactionDetails(transaction)}
            >
              <TableCell className="max-w-[250px] pl-8 pr-10">
                <div className="flex items-center gap-3">
                  <h1 className="text-sm truncate font-semibold text-[#344054]">
                    {transaction.amount > 0 ? `${transaction.from_account_username}` : `${transaction.to_account_username}`}
                    {/* {transaction.amount > 0
                      ? `${transaction.from_account_username} - ${transaction.from_account_type}`
                      : `${transaction.to_account_username} - ${transaction.to_account_type}`} */}
                  </h1>
                </div>
              </TableCell>
              <TableCell className="text-sm min-w-32 pl-2 pr-10">
                {formatDateTime(transaction.paid_on)}
              </TableCell>
              <TableCell className={`text-sm pl-2 pr-10 font-semibold ${transaction.amount > 0 ? 'text-green-100' : 'text-red-200'}`}>
                {transaction.amount > 0 ? `+${formatAmount(transaction.amount)}` : `-${formatAmount(Math.abs(transaction.amount))}`}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedTransaction && (
        <TransactionDetailSheet
          transaction={selectedTransaction}
          onClose={closeTransactionDetails}
        />
      )}
    </>
  );
};