"use client";

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

export const InboxTable = ({ messages = [], markAsRead }: InboxTableProps) => {
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

    const openMessageDetails = (message: Message) => {
      // Optional: Mark the message as read when clicked
      if (!message.isRead) {
        markAsRead(message.id);
      }
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
                    className={cn(
                      "cursor-pointer hover:bg-gray-100",
                      m.isRead ? "bg-stone-100" : "bg-white" // Darker background for read messages
                    )}
                    onClick={() => openMessageDetails(m)} // Open the sheet on row click
                    >
                    <TableCell className="max-w-[250px] pl-8 pr-10">
                        <div className="flex items-center gap-3">
                            {/* Apply conditional bold styling for unread messages */}
                            <h1
                              className={cn(
                                "text-14 truncate",
                                m.isRead
                                  ? "font-normal text-gray-500" // Grey text for read messages
                                  : "font-bold" // Bold for unread messages, no underline
                              )}
                            >
                                {m.from_account}
                            </h1>
                        </div>
                    </TableCell>
    
                    <TableCell
                      className={cn(
                        "pl-4 pr-10",
                        m.isRead
                          ? "font-normal text-gray-500" // Grey text for read messages
                          : "font-bold" // Bold for unread messages, no underline
                      )}
                    >
                        {m.description}
                    </TableCell>
    
                    <TableCell
                      className={cn(
                        "min-w-32 pl-2 pr-10",
                        m.isRead
                          ? "font-normal text-gray-500" // Grey text for read messages
                          : "font-bold" // Bold for unread messages, no underline
                      )}
                    >
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
