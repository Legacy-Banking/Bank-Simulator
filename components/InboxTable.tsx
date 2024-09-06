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
import InboxDetailSheet from './InboxDetailSheet';
import { cn, formatDateTime } from '@/lib/utils';


export const InboxTable = ({ messages = [] }: InboxTableProps) => {
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  
    const openMessageDetails = (message: Message) => {
      setSelectedMessage(message);
    };
  
    const closeItemDetails = () => {
      setSelectedMessage(null);
    };
  
    return (
      <>
        <Table>
          <TableCaption>A list of your recent notifications.</TableCaption>
          <TableHeader>
            <TableRow className="bg-blue-200 text-white-200">
              <TableHead className="px-8 rounded-tl-2xl">Name</TableHead>
              <TableHead className="px-2">Description</TableHead>
              <TableHead className="px-2 rounded-tr-2xl">Date Received</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((m: Message) => {
                return (
                    <TableRow
                    key={m.id}
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => openMessageDetails(m)} // Open the sheet on row click
                    >
                    <TableCell className="max-w-[250px] pl-8 pr-10">
                        <div className="flex items-center gap-3">
                            <h1 className="text-14 truncate font-semibold text-[#344054]">
                                {m.from_account}
                            </h1>
                        </div>
                    </TableCell>
    
                    <TableCell className="pl-4 pr-10">
                        {m.description}
                    </TableCell>
    
                    <TableCell className="min-w-32 pl-2 pr-10">
                        {formatDateTime(m.date_received)}
                    </TableCell>
                    </TableRow>
                );
            })}
          </TableBody>
        </Table>
  
        <InboxDetailSheet
          message={selectedMessage}
          onClose={closeItemDetails}
        />
      </>
    );
  };