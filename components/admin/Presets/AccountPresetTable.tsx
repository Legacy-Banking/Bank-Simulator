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
} from "@/components/shadcn_ui/table";
// import TransactionDetailSheet from './TransactionDetailSheet'; // Import the sheet component
import { cn, formatAmount, formatDateTime } from "@/lib/utils/utils";
import { Button } from '@/components/shadcn_ui/button';
import TrashAccountDetailSheet from '../Accounts/TrashAccountDetailSheet';
import { boolean } from 'zod';
import EditAccountPresetDetailSheet from './Editing Items/EditAccountPresetDetailSheet';
import TrashAccountPresetDetailSheet from './Deleting Items/TrashAccountPresetDetailSheet';

// AccountPresetTable component
export const AccountPresetTable = ({ accountTypes = [], setShowUpdatePopUp, setShowDeletePopUp, onEditStatus }: AccountPresetTableProps) => {
  const [selectedAccountPreset, setSelectedAccountPreset] = useState<AccountPresetType | null>(null);
  const [deleteAccountPresetWindow, setDeleteAccountPresetWindow] = useState(false);
  const [editAccountPresetWindow, setEditAccountPresetWindow] = useState(false);

  const toggleDeleteAccountPresetWindow = (acc : AccountPresetType | null) => {
    setDeleteAccountPresetWindow((prevState) => !prevState);
    setSelectedAccountPreset(acc);
  };

  const toggleEditAccountPresetWindow = (acc : AccountPresetType | null) => {
      
    setEditAccountPresetWindow((prevState) => !prevState);
    setSelectedAccountPreset(acc);
    
  };

  const deleteAccountPreset = () => {
    // currently empty but this will delete the selected account
    toggleDeleteAccountPresetWindow(null);
    setShowDeletePopUp(true);
    onEditStatus();
  }
  const updateAccountPreset = () => {
    toggleEditAccountPresetWindow(null);
    setShowUpdatePopUp(true);
    onEditStatus();
    // currently empty but this will update the selected account
  }

  function formatToCurrency(amount: number | undefined): string {
    if (!amount) {
        return '$0.00';
    }
    const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format(amount);

    return formattedAmount;
}
  return (
    <>
      <Table>
        <TableHeader >
          <TableRow className="bg-blue-200 text-white-200">
            <TableHead className="font-inter px-8 rounded-tl-2xl font-normal tracking-wider">Account Type</TableHead>
            <TableHead className="font-inter px-4 font-normal tracking-wider">Starting Balance</TableHead>
            <TableHead className="font-inter px-8 rounded-tr-2xl font-normal tracking-wider">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {accountTypes.map((accountType: AccountPresetType) => {
            const account = accountType.account_type;
            const startingBalance = accountType.starting_balance;
            return (
              <TableRow
                key={accountType.id}
              >
                <TableCell className="max-w-[200px] pl-8 pr-10">
                  <div className="flex items-center gap-3">
                    <h1 className="font-inter text-16 truncate font-medium text-[#344054]">
                      {/* Show from_account for positive amounts, and to_account or to_biller based on whether to_account is null */}
                      {account}
                    </h1>
                  </div>
                </TableCell>


                <TableCell className="font-inter text-lg ">
                  {formatToCurrency(startingBalance)}
                </TableCell>
                
                <TableCell >
                    <Button onClick={() => toggleEditAccountPresetWindow(accountType)} className="p-0 ml-4"> <img src="../Edit.png" alt="Edit button" /></Button>
                    <Button onClick={() => toggleDeleteAccountPresetWindow(accountType)} className="p-0 ml-4"> <img src="../Delete.png" alt="Delete button" /></Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <TrashAccountPresetDetailSheet
        accountPreset={selectedAccountPreset}
        status={deleteAccountPresetWindow}
        onClose={() => toggleDeleteAccountPresetWindow(selectedAccountPreset)}
        deleteAccountPreset={deleteAccountPreset}
      />
      <EditAccountPresetDetailSheet
        accountPreset={selectedAccountPreset}
        status={editAccountPresetWindow}
        onClose={() => toggleEditAccountPresetWindow(selectedAccountPreset)}
        updateAccountPreset={updateAccountPreset}
        />

    </>
    
  );
};
export default AccountPresetTable;