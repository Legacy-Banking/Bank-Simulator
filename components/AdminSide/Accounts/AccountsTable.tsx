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
// import TransactionDetailSheet from './TransactionDetailSheet'; // Import the sheet component
import { cn, formatAmount, formatDateTime } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import TrashAccountDetailSheet from './TrashAccountDetailSheet';
import { boolean } from 'zod';

// AccountsTable component
export const AccountsTable = ({ accounts = [] }: AccountsTableProps) => {
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [deleteAccountWindow, setDeleteAccountWindow] = useState(false);
  const [editAccountWindow, setEditAccountWindow] = useState(false);

  const toggleDeleteAccountWindow = () => {
    setDeleteAccountWindow((prevState) => !prevState);
  };

  const toggleEditAccountWindow = () => {
    setEditAccountWindow((prevState) => !prevState);
  };

  const deleteAccount = () => {
    // currently empty but this will delete the selected account
  }


  return (
    <>
      <Table>
        <TableHeader >
          <TableRow className="bg-blue-200 text-white-200">
            <TableHead className="px-8 rounded-tl-2xl font-normal tracking-wider">Account Name</TableHead>
            <TableHead className="px-4 font-normal tracking-wider">Balance</TableHead>
            <TableHead className="px-2 font-normal tracking-wider">Last Login</TableHead>
            <TableHead className="px-8 rounded-tr-2xl font-normal tracking-wider">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {accounts.map((acc: Account) => {
            const accountName = acc.owner_username;
            const balance = acc.balance;
            const lastLogin = new Date();

            return (
              <TableRow
                key={acc.id}
              >
                <TableCell className="max-w-[200px] pl-8 pr-10">
                  <div className="flex items-center gap-3">
                    <h1 className="text-16 truncate font-semibold text-[#344054]">
                      {/* Show from_account for positive amounts, and to_account or to_biller based on whether to_account is null */}
                      {accountName}
                    </h1>
                  </div>
                </TableCell>


                <TableCell className="font-bold">
                  {formatAmount(balance)}
                </TableCell>

                <TableCell className="min-w-32 pl-2 pr-10 text-[#475467]">
                  {lastLogin.toDateString()}
                </TableCell>
                
                <TableCell >
                    <Button onClick={toggleEditAccountWindow} className="p-0 ml-4"> <img src="../Edit.png" alt="Edit button" /></Button>
                    <Button onClick={toggleDeleteAccountWindow} className="p-0 ml-4"> <img src="../Delete.png" alt="Delete button" /></Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <TrashAccountDetailSheet
        status={deleteAccountWindow}
        onClose={toggleDeleteAccountWindow}
        deleteAccount={deleteAccount}
      />
    </>
  );
};
