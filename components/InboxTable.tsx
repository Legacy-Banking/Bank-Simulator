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
import { formatDateTime } from '@/lib/utils';
import { inboxAction } from '@/utils/inboxAction';


export const InboxTable = ({ messages = [] }: InboxTableProps) => {
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  
    const openMessageDetails = (message: Message) => {
      setSelectedMessage(message);
      inboxAction.readMessage(message);
      message.read = true;
    };
  
    const closeItemDetails = () => {
      setSelectedMessage(null);
    };
  
    return (
      <>
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-200 text-white-200">
              <TableHead className="px-8 rounded-tl-2xl">Name</TableHead>
              <TableHead className="px-2">Description</TableHead>
              <TableHead className="px-2 rounded-tr-2xl">Date Received</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((message: Message) => {
              const isRead = message.read;
                return (
                    <TableRow
                    key={message.id}
                    className={`cursor-pointer ${isRead ? 'bg-stone-100' : 'bg-white hover:bg-gray-100'}`}
                    onClick={() => openMessageDetails(message)} // Open the sheet on row click
                    >
                    <TableCell className="max-w-[250px] pl-8 pr-10">
                        <div className="flex items-center gap-3">
                        <h1 className={`text-14 truncate ${isRead ? 'font-normal text-gray-500' : 'font-semibold text-[#344054]'}`}>
                                {message.sender_name}
                            </h1>
                        </div>
                    </TableCell>
    
                    <TableCell className={`pl-4 pr-10 ${isRead ? 'text-gray-500' : ''}`}>
                        {message.description}
                    </TableCell>
    
                    <TableCell className={`min-w-32 pl-2 pr-10 ${isRead ? 'text-gray-500' : ''}`}>
                        {formatDateTime(message.date_received)}
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