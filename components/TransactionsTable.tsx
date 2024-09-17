"use client"

import React, { useState, useEffect } from 'react';
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
import { accountAction } from '@/utils/accountAction';
import { cn, formatAmount, formatDateTime, capitalizeFirstLetter } from "@/lib/utils";

// TransactionsTable component
export const TransactionsTable = ({ transactions = [] }: TransactionTableProps) => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [accountTypes, setAccountTypes] = useState<{ [key: string]: { from: string, to: string } }>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchAccountTypes = async (transaction: Transaction) => {
    try {
      const fromAccountType = await accountAction.fetchAccountType(transaction.from_account);
      const toAccountType = transaction.to_account ? await accountAction.fetchAccountType(transaction.to_account) : 'unknown'; // assuming there might not always be a to_account

      setAccountTypes(prevTypes => ({
        ...prevTypes,
        [transaction.id]: {
          from: fromAccountType || 'unknown', // Default to 'unknown' if not fetched
          to: toAccountType || 'unknown'
        }
      }));
    } catch (error) {
      console.error('Failed to fetch account types:', error);
    }
  };

  useEffect(() => {
    const fetchAllAccountTypes = async () => {
      setIsLoading(true);
      await Promise.all(transactions.map((transaction) => {
        if (transaction.to_account_username === transaction.from_account_username) {
          return fetchAccountTypes(transaction);
        }
      }));
      setIsLoading(false);
    };

    fetchAllAccountTypes();
  }, [transactions]);

  // useEffect(() => {
  //   transactions.forEach(transaction => {
  //     if (transaction.to_account_username === transaction.from_account_username) {
  //       fetchAccountTypes(transaction);
  //     }
  //   });
  // }, [transactions]);

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
                      {/* Conditional rendering based on isLoading */}
                      {isLoading ? 'Loading...' : (
                        isPositive ? (
                          t.to_account_username === t.from_account_username ? (
                            accountTypes[t.id] ? `${capitalizeFirstLetter(accountTypes[t.id].from)} Account` : 'Unknown Account'
                          ) : `${t.from_account_username}`
                        ) : (
                          t.to_account ? (
                            t.to_account_username === t.from_account_username ? (
                              accountTypes[t.id] ? `${capitalizeFirstLetter(accountTypes[t.id].to)} Account` : 'Unknown Account'
                            ) : `${t.to_account_username}`
                          ) : `(Biller) ${t.to_account_username}`
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
        accountTypes={accountTypes}
        onClose={closeTransactionDetails}
      />
    </>
  );
};
