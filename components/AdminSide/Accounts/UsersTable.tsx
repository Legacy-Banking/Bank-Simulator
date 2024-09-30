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
import { boolean } from 'zod';
import PopUp from './PopUp';
import { createClient } from '@/utils/supabase/client';
import { accountAction } from '@/utils/accountAction';
import OpenUserAccountsDetailSheet from './OpenUserAccountsDetailSheet';
import TrashUserDetailSheet from './TrashUserDetailSheet';
import EditUserDetailSheet from './EditUserDetailSheet';

// UsersTable component
export const UsersTable = ({ accounts = [], setShowUpdatePopUp, setShowDeletePopUp, onEditStatus }: UsersTableProps) => {
  const [selectedUser, setSelectedUser] = useState<Account | null>(null);
  const [deleteUserWindow, setDeleteUserWindow] = useState(false);
  const [editUserWindow, setEditUserWindow] = useState(false);
  const [openUserAccountsWindow, setOpenUserAccountsWindow] = useState(false);
  const [selectedUserAccounts, setSelectedUserAccounts] = useState<Account []>([]);
  const [userBalances, setUserBalances] = useState<{ [key: string]: number }>({}); // State to store balances by user ID

  const toggleDeleteUserWindow = (acc : Account | null) => {
    setDeleteUserWindow((prevState) => !prevState);
    setSelectedUser(acc);
  };

  const toggleEditUserWindow = (acc : Account | null) => {
      
    setEditUserWindow((prevState) => !prevState);
    setSelectedUser(acc);
    
  };

  const deleteUser = () => {
    toggleDeleteUserWindow(null);
    setShowDeletePopUp(true);
    onEditStatus();
  }
  const updateUser = () => {
    toggleEditUserWindow(null);
    setShowUpdatePopUp(true);
    onEditStatus();
  }
  const toggleOpenUserAccountsWindow = async (userId : string | null) => {
    setOpenUserAccountsWindow((prevState) => !prevState)
    if (userId) {
      setSelectedUserAccounts(await accountAction.fetchAccountsbyUserId(userId));
    }
  }
   // Fetch and set the total balance for a user
   const fetchTotalBalance = async (userId: string) => {
    try {
      const balance = await accountAction.fetchAccountsTotalBalance(userId);
      setUserBalances((prevBalances) => ({
        ...prevBalances,
        [userId]: balance,
      }));
    } catch (error) {
      console.error('Error fetching total balance:', error);
    }
  };

  useEffect(() => {
    // Fetch total balances for all accounts when the component mounts
    accounts.forEach((acc: Account) => {
      if (!userBalances[acc.owner]) {
        fetchTotalBalance(acc.owner);
      }
    });
  }, [accounts]); // Re-run effect when accounts change

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
            const lastLogin = new Date();

            return (
              <TableRow
                key={acc.id}
              >
                <TableCell className="max-w-[200px] pl-8 pr-10" 
                onClick={() => toggleOpenUserAccountsWindow(acc.owner)}
                
                >
                  <div className="flex items-center gap-3">
                    <h1 className="font-inter text-16 truncate font-semibold text-[#344054] cursor-pointer">
                      {/* Show from_account for positive amounts, and to_account or to_biller based on whether to_account is null */}
                      {accountName}
                    </h1>
                  </div>
                </TableCell>


                <TableCell className="font-inter font-bold"
                onClick={() => toggleOpenUserAccountsWindow(acc.owner)}
                
                >
                  <span className='cursor-pointer'>
                    {formatAmount(userBalances[acc.owner])}
                  </span>
                </TableCell>

                <TableCell className="font-inter min-w-32 pl-2 pr-10 text-[#475467] ">
                    {lastLogin.toDateString()}
                </TableCell>
                
                <TableCell >
                    <Button onClick={() => toggleEditUserWindow(acc)} className="p-0 ml-4"> <img src="../Edit.png" alt="Edit button" /></Button>
                    <Button onClick={() => toggleDeleteUserWindow(acc)} className="p-0 ml-4"> <img src="../Delete.png" alt="Delete button" /></Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <TrashUserDetailSheet
        account={selectedUser}
        status={deleteUserWindow}
        onClose={() => toggleDeleteUserWindow(selectedUser)}
        deleteUser={deleteUser}
      />
      <EditUserDetailSheet
        account={selectedUser}
        status={editUserWindow}
        onClose={() => toggleEditUserWindow(selectedUser)}
        updateUser={updateUser}
        />
      <OpenUserAccountsDetailSheet
      accounts={selectedUserAccounts}
      status={openUserAccountsWindow}
      onClose={() => toggleOpenUserAccountsWindow(null)}
      />
    </>
  );
};
