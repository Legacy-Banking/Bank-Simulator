"use client"

import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import TransactionDetailSheet from './TransactionDetailSheet'; // Import the sheet component
import { cn, formatAmount, formatDateTime } from "@/lib/utils";
import { Button } from '@/components/ui/button';

// TransactionsTable component
export const TransactionAdminTable = ({ transactionPresets = [], setShowUpdatePopUp, setShowDeletePopUp }: TransactionPresetTableProps) => {
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionPresetType | null>(null);
  const [deleteTransactionWindow, setDeleteTransactionWindow] = useState(false);
  const [editTransactionWindow, setEditTransactionWindow] = useState(false);

  const toggleDeleteTransactionWindow = () => {
    setDeleteTransactionWindow((prevState) => !prevState);
  };

  const toggleEditTransactionWindow = (acc : TransactionPresetType | null) => {
      
    setEditTransactionWindow((prevState) => !prevState);
    setSelectedTransaction(acc);
    
  };

  const deleteTransaction = () => {
    // currently empty but this will delete the selected account
    toggleDeleteTransactionWindow();
    setShowDeletePopUp(true);
  }
  const updateTransaction = () => {
    toggleEditTransactionWindow(null);
    setShowUpdatePopUp(true);
    // currently empty but this will update the selected account
  }



  return (
    <>
      <Table>
        <TableHeader >
          <TableRow className="bg-blue-200 text-white-200">
            <TableHead className="font-inter px-8 rounded-tl-2xl font-normal tracking-wider">Recipient</TableHead>
            <TableHead className="font-inter px-4 font-normal tracking-wider">Date Issued</TableHead>
            <TableHead className="font-inter px-2 font-normal tracking-wider">Amount</TableHead>
            <TableHead className="font-inter px-8 rounded-tr-2xl font-normal tracking-wider">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {transactionPresets.map((acc: TransactionPresetType) => {
            const recipient = acc.recipient;
            const date = acc.date_issued;
            const amount = acc.amount;

            return (
              <TableRow
                key={acc.id}
              >
                <TableCell className="max-w-[200px] pl-8 pr-10">
                  <div className="flex items-center gap-3">
                    <h1 className="font-inter text-16 truncate font-semibold text-[#344054]">
                      {/* Show from_account for positive amounts, and to_account or to_biller based on whether to_account is null */}
                      {recipient}
                    </h1>
                  </div>
                </TableCell>

                <TableCell className="font-inter min-w-32 pl-2 pr-10 text-[#475467]">
                  {date.toDateString()}
                </TableCell>


                <TableCell className="font-inter font-bold">
                  {formatAmount(amount)}
                </TableCell>
                
                <TableCell >
                    <Button onClick={() => toggleEditTransactionWindow(acc)} className="p-0 ml-4"> <img src="../Edit.png" alt="Edit button" /></Button>
                    <Button onClick={toggleDeleteTransactionWindow} className="p-0 ml-4"> <img src="../Delete.png" alt="Delete button" /></Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* <TrashTransactionDetailSheet
        account={selectedTransaction}
        status={deleteTransactionWindow}
        onClose={toggleDeleteTransactionWindow}
        deleteTransaction={deleteTransaction}
      />
      <EditTransactionDetailSheet
        account={selectedTransaction}
        status={editTransactionWindow}
        onClose={() => toggleEditTransactionWindow(selectedTransaction)}
        updateTransaction={updateTransaction}
        /> */}

    </>
  );
};
export default TransactionAdminTable;