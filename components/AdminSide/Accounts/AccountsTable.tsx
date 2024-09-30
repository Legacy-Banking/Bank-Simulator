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
import TrashAccountDetailSheet from './TrashAccountDetailSheet';
import { boolean } from 'zod';
import EditAccountDetailSheet from './EditAccountDetailSheet';
import PopUp from './PopUp';
import { createClient } from '@/utils/supabase/client';
import { accountAction } from '@/utils/accountAction';
import OpenUserAccountsDetailSheet from './OpenUserAccountsDetailSheet';

// AccountsTable component
export const AccountsTable = ({ accounts = [], setShowUpdatePopUp, setShowDeletePopUp }: AccountsTableProps) => {
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [deleteAccountWindow, setDeleteAccountWindow] = useState(false);
  const [editAccountWindow, setEditAccountWindow] = useState(false);
  const [openUserAccountsWindow, setOpenUserAccountsWindow] = useState(false);
  const [selectedUserAccounts, setSelectedUserAccounts] = useState<Account []>([]);
  const toggleDeleteAccountWindow = () => {
    setDeleteAccountWindow((prevState) => !prevState);
  };

  const toggleEditAccountWindow = (acc : Account | null) => {
      
    setEditAccountWindow((prevState) => !prevState);
    setSelectedAccount(acc);
    
  };

  const deleteAccount = () => {
    // currently empty but this will delete the selected account
    toggleDeleteAccountWindow();
    setShowDeletePopUp(true);
  }
  const updateAccount = () => {
    toggleEditAccountWindow(null);
    setShowUpdatePopUp(true);
    // currently empty but this will update the selected account
  }
  const toggleOpenUserAccountsWindow = async (userId : string | null) => {
    setOpenUserAccountsWindow((prevState) => !prevState)
    if (userId) {
      setSelectedUserAccounts(await accountAction.fetchAccountsbyUserId(userId));
    }
  }

  return (
    <>
      <Table>
        <TableHeader >
          <TableRow className="bg-blue-200 text-white-200">
            <TableHead className="font-inter px-8 rounded-tl-2xl font-normal tracking-wider">Account Name</TableHead>
            <TableHead className="font-inter px-4 font-normal tracking-wider">Total Balance</TableHead>
            <TableHead className="font-inter px-2 font-normal tracking-wider">Last Login</TableHead>
            <TableHead className="font-inter px-8 rounded-tr-2xl font-normal tracking-wider">Action</TableHead>
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
                onClick={() => toggleOpenUserAccountsWindow(acc.owner)}
              >
                <TableCell className="max-w-[200px] pl-8 pr-10">
                  <div className="flex items-center gap-3">
                    <h1 className="font-inter text-16 truncate font-semibold text-[#344054] cursor-pointer">
                      {/* Show from_account for positive amounts, and to_account or to_biller based on whether to_account is null */}
                      {accountName}
                    </h1>
                  </div>
                </TableCell>


                <TableCell className="font-inter font-bold">
                  <span className='cursor-pointer'>
                    {formatAmount(balance)}
                  </span>
                </TableCell>

                <TableCell className="font-inter min-w-32 pl-2 pr-10 text-[#475467] ">
                  <span className='cursor-pointer'>
                    {lastLogin.toDateString()}
                  </span>
                </TableCell>
                
                <TableCell >
                    <Button onClick={() => toggleEditAccountWindow(acc)} className="p-0 ml-4"> <img src="../Edit.png" alt="Edit button" /></Button>
                    <Button onClick={toggleDeleteAccountWindow} className="p-0 ml-4"> <img src="../Delete.png" alt="Delete button" /></Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <TrashAccountDetailSheet
        account={selectedAccount}
        status={deleteAccountWindow}
        onClose={toggleDeleteAccountWindow}
        deleteAccount={deleteAccount}
      />
      <EditAccountDetailSheet
        account={selectedAccount}
        status={editAccountWindow}
        onClose={() => toggleEditAccountWindow(selectedAccount)}
        updateAccount={updateAccount}
        />
      <OpenUserAccountsDetailSheet
      accounts={selectedUserAccounts}
      status={openUserAccountsWindow}
      onClose={() => toggleOpenUserAccountsWindow(null)}
      />
    </>
  );
};
