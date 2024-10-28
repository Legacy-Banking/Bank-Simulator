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
// import EditAccountDetailSheet from '../Accounts/EditAccountDetailSheet';
import PopUp from '../Accounts/PopUp';
import EditConstantDetailSheet from './EditConstantDetailSheet';
import TrashConstantDetailSheet from './TrashConstantDetailSheet';

// ConstantTable component
export const ConstantTable = ({ constants = [], setShowUpdatePopUp, setShowDeletePopUp, onEditStatus }: ConstantsTableProps) => {
  const [selectedConstant, setSelectedConstant] = useState<Constant | null>(null);
  const [deleteConstantWindow, setDeleteConstantWindow] = useState(false);
  const [editConstantWindow, setEditConstantWindow] = useState(false);

  const toggleDeleteConstantWindow = (acc : Constant | null) => {
    setDeleteConstantWindow((prevState) => !prevState);
    setSelectedConstant(acc);
  };

  const toggleEditConstantWindow = (acc : Constant | null) => {
      
    setEditConstantWindow((prevState) => !prevState);
    setSelectedConstant(acc);
    
  };

  const deleteConstant = () => {
    toggleDeleteConstantWindow(null);
    setShowDeletePopUp(true);
    onEditStatus();
  }
  const updateConstant = () => {
    toggleEditConstantWindow(null);
    setShowUpdatePopUp(true);
    onEditStatus();
  }



  return (
    <>
      <Table>
        <TableHeader >
          <TableRow className="bg-blue-200 text-white-200">
            <TableHead className="font-inter px-8 rounded-tl-2xl font-normal tracking-wider">Key</TableHead>
            <TableHead className="font-inter px-4 font-normal tracking-wider">Content</TableHead>
            <TableHead className="font-inter px-2 font-normal tracking-wider">Page</TableHead>
            <TableHead className="font-inter px-8 rounded-tr-2xl font-normal tracking-wider">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {constants.map((acc: Constant) => {
            const key = acc.key;
            const content = acc.content;
            const page_key = acc.page_key;

            return (
              <TableRow
                key={acc.id}
              >
                <TableCell className="max-w-[200px] pl-8">
                  <div className="flex items-center gap-3">
                    <h1 className="font-inter font-bold text-16 truncate">
                      {/* Show from_account for positive amounts, and to_account or to_biller based on whether to_account is null */}
                      {key}
                    </h1>
                  </div>
                </TableCell>


                <TableCell className="font-inter text-lg truncate">
                  {content}
                </TableCell>

                <TableCell className="font-inter text-base pl-2 pr-10 ">
                  {page_key}
                </TableCell>
                
                <TableCell >
                    <Button onClick={() => toggleEditConstantWindow(acc)} className="p-0 ml-4"> <img src="../Edit.png" alt="Edit button" /></Button>
                    <Button onClick={() => toggleDeleteConstantWindow(acc)} className="p-0 ml-4"> <img src="../Delete.png" alt="Delete button" /></Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <TrashConstantDetailSheet
        constant={selectedConstant}
        status={deleteConstantWindow}
        onClose={() => toggleDeleteConstantWindow(selectedConstant)}
        deleteConstant={deleteConstant}
      />
      <EditConstantDetailSheet
        constant={selectedConstant}
        status={editConstantWindow}
        onClose={() => toggleEditConstantWindow(selectedConstant)}
        updateConstant={updateConstant}
        />

    </>
  );
};
export default ConstantTable;