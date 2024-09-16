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
import { Pagination } from './Pagination';

export const InboxTable = ({ messages = [], markAsRead }: InboxTableProps) => {
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [page, setPage] = useState(1); // Current page state
    const messagesPerPage = 5; // Number of messages per page

    // Calculate total number of pages
    const totalPages = Math.ceil(messages.length / messagesPerPage);

    // Get the messages to display on the current page
    const paginatedMessages = messages.slice(
        (page - 1) * messagesPerPage,
        page * messagesPerPage
    );

    const openMessageDetails = (message: Message) => {
        // Mark the message as read when clicked
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
                    {paginatedMessages.map((m: Message) => (
                        <TableRow
                            key={m.id}
                            className={cn(
                                "cursor-pointer hover:bg-gray-100",
                                m.isRead ? "bg-stone-100" : "bg-white"
                            )}
                            onClick={() => openMessageDetails(m)}
                        >
                            <TableCell className="max-w-[250px] pl-8 pr-10">
                                <div className="flex items-center gap-3">
                                    <h1
                                        className={cn(
                                            "text-14 truncate",
                                            m.isRead
                                                ? "font-normal text-gray-500"
                                                : "font-bold"
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
                                        ? "font-normal text-gray-500"
                                        : "font-bold"
                                )}
                            >
                                {m.description}
                            </TableCell>

                            <TableCell
                                className={cn(
                                    "min-w-32 pl-2 pr-10",
                                    m.isRead
                                        ? "font-normal text-gray-500"
                                        : "font-bold"
                                )}
                            >
                                {formatDateTime(m.date_received)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Pagination Component */}
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />

            {/* Inbox Detail Sheet */}
            <InboxDetailSheet message={selectedMessage} onClose={closeItemDetails} />
        </>
    );
};
