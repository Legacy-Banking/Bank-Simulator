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
import TrashAccountDetailSheet from '../Accounts/TrashAccountDetailSheet';
import { boolean } from 'zod';
// import EditAccountDetailSheet from '../Accounts/EditAccountDetailSheet';
import PopUp from '../Accounts/PopUp';
import EditBillerDetailSheet from './Editing Items/EditBillerDetailSheet';
import TrashBillerDetailSheet from './Deleting Items/TrashBillerDetailSheet';
import SavedStatus from './SavedStatus';

// BillersTable component
export const BillersTable = ({ billers = [], setShowUpdatePopUp, setShowDeletePopUp, onEditStatus }: BillersTableProps) => {
  const [selectedBiller, setSelectedBiller] = useState<Biller | null>(null);
  const [deleteBillerWindow, setDeleteBillerWindow] = useState(false);
  const [editBillerWindow, setEditBillerWindow] = useState(false);

  const toggleDeleteBillerWindow = (acc : Biller | null) => {
    setDeleteBillerWindow((prevState) => !prevState);
    setSelectedBiller(acc);
  };

  const toggleEditBillerWindow = (acc : Biller | null) => {
      
    setEditBillerWindow((prevState) => !prevState);
    setSelectedBiller(acc);
    
  };

  const deleteBiller = () => {
    // currently empty but this will delete the selected account
    toggleDeleteBillerWindow(null);
    setShowDeletePopUp(true);
    onEditStatus();
  }
  const updateBiller = () => {
    toggleEditBillerWindow(null);
    setShowUpdatePopUp(true);
    onEditStatus();
    // currently empty but this will update the selected account
  }


  return (
    <>
      <Table>
        <TableHeader >
          <TableRow className="bg-blue-200 text-white-200">
            <TableHead className="font-inter px-8 rounded-tl-2xl font-normal tracking-wider">Biller Code</TableHead>
            <TableHead className="font-inter px-4 font-normal tracking-wider">Biller Name</TableHead>
            <TableHead className="font-inter px-2 font-normal tracking-wider">Saved Status</TableHead>
            <TableHead className="font-inter px-8 rounded-tr-2xl font-normal tracking-wider">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {billers.map((biller: Biller) => {
            const billerCode = biller.biller_code;
            const billerName = biller.name;
            const savedStatus = biller.save_biller_status;
            const referenceNumber = biller.reference_number;

            return (
              <TableRow
                key={biller.id}
              >
                <TableCell className="max-w-[200px] pl-8 pr-10">
                  <div className="flex items-center gap-3">
                    <h1 className="font-inter text-16 truncate font-medium text-[#344054]">
                      {/* Show from_account for positive amounts, and to_account or to_biller based on whether to_account is null */}
                      {billerCode}
                    </h1>
                  </div>
                </TableCell>


                <TableCell className="font-inter text-lg ">
                  {billerName}
                </TableCell>

                <TableCell className="font-inter text-base pl-2 ">
                  <SavedStatus status={savedStatus}></SavedStatus>
                </TableCell>
                
                <TableCell >
                    <Button onClick={() => toggleEditBillerWindow(biller)} className="p-0 ml-4"> <img src="../Edit.png" alt="Edit button" /></Button>
                    <Button onClick={() => toggleDeleteBillerWindow(biller)} className="p-0 ml-4"> <img src="../Delete.png" alt="Delete button" /></Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <TrashBillerDetailSheet
        biller={selectedBiller}
        status={deleteBillerWindow}
        onClose={() => toggleDeleteBillerWindow(selectedBiller)}
        deleteBiller={deleteBiller}
      />
      <EditBillerDetailSheet
        biller={selectedBiller}
        status={editBillerWindow}
        onClose={() => toggleEditBillerWindow(selectedBiller)}
        updateBiller={updateBiller}
        />

    </>
    
  );
};
export default BillersTable;