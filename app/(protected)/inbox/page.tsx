"use client";

import React, { useState, useEffect } from 'react';
import HeaderBox from '@/components/HeaderBox';
import { InboxTable } from '@/components/InboxTable';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { accountAction } from '@/utils/accountAction';
import { useSearchParams } from 'next/navigation';
import AccountBox from '@/components/AccountBox';

interface Message {
  id: string;
  description: string;
  date_received: string;
  from_account: string;
  to_account: string;
  isRead: boolean; // New field to track if the message is read or not
}

const Inbox = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  // Step 1: Create mockup messages with isRead property
  const mockMessages: Message[] = [
    {
      id: "1",
      description: "Your account has been credited with $500.",
      date_received: "2024-08-20T10:30:00Z",
      from_account: "Bank A",
      to_account: "Your Account",
      isRead: false, // unread message
    },
    {
      id: "2",
      description: "A new statement is available for your credit card.",
      date_received: "2024-08-21T15:00:00Z",
      from_account: "Credit Card Service",
      to_account: "Your Account",
      isRead: true, // read message
    },
    {
      id: "3",
      description: "Your payment for the electricity bill is overdue.",
      date_received: "2024-08-22T09:15:00Z",
      from_account: "Utility Company",
      to_account: "Your Account",
      isRead: false, // unread message
    },
    {
      id: "4",
      description: "You have received a new promotional offer from our bank.",
      date_received: "2024-08-23T11:45:00Z",
      from_account: "Bank B",
      to_account: "Your Account",
      isRead: true, // read message
    },
    {
      id: "5",
      description: "Reminder: Your insurance premium is due tomorrow.",
      date_received: "2024-08-24T08:00:00Z",
      from_account: "Insurance Company",
      to_account: "Your Account",
      isRead: false, // unread message
    },
    {
      id: "6",
      description: "Your account has been credited with $500.",
      date_received: "2024-08-20T10:30:00Z",
      from_account: "Bank A",
      to_account: "Your Account",
      isRead: false, // unread message
    },
    {
      id: "7",
      description: "A new statement is available for your credit card.",
      date_received: "2024-08-21T15:00:00Z",
      from_account: "Credit Card Service",
      to_account: "Your Account",
      isRead: true, // read message
    },
    {
      id: "8",
      description: "Your payment for the electricity bill is overdue.",
      date_received: "2024-08-22T09:15:00Z",
      from_account: "Utility Company",
      to_account: "Your Account",
      isRead: false, // unread message
    },
    {
      id: "9",
      description: "You have received a new promotional offer from our bank.",
      date_received: "2024-08-23T11:45:00Z",
      from_account: "Bank B",
      to_account: "Your Account",
      isRead: true, // read message
    },
    {
      id: "10",
      description: "Reminder: Your insurance premium is due tomorrow.",
      date_received: "2024-08-24T08:00:00Z",
      from_account: "Insurance Company",
      to_account: "Your Account",
      isRead: false, // unread message
    },
    {
      id: "11",
      description: "Your account has been credited with $500.",
      date_received: "2024-08-20T10:30:00Z",
      from_account: "Bank A",
      to_account: "Your Account",
      isRead: false, // unread message
    },
    {
      id: "12",
      description: "A new statement is available for your credit card.",
      date_received: "2024-08-21T15:00:00Z",
      from_account: "Credit Card Service",
      to_account: "Your Account",
      isRead: true, // read message
    },
    {
      id: "13",
      description: "Your payment for the electricity bill is overdue.",
      date_received: "2024-08-22T09:15:00Z",
      from_account: "Utility Company",
      to_account: "Your Account",
      isRead: false, // unread message
    },
    {
      id: "14",
      description: "You have received a new promotional offer from our bank.",
      date_received: "2024-08-23T11:45:00Z",
      from_account: "Bank B",
      to_account: "Your Account",
      isRead: true, // read message
    },
    {
      id: "15",
      description: "Reminder: Your insurance premium is due tomorrow.",
      date_received: "2024-08-24T08:00:00Z",
      from_account: "Insurance Company",
      to_account: "Your Account",
      isRead: false, // unread message
    },
  ];

  // Step 2: Load mock messages into state on component mount
  useEffect(() => {
    setMessages(mockMessages);
  }, []);

  // Optional: Function to mark a message as read
  const markAsRead = (messageId: string) => {
    setMessages((prevMessages) =>
      prevMessages.map((message) =>
        message.id === messageId ? { ...message, isRead: true } : message
      )
    );
  };

  return (
    <>
      <section className="flex w-full flex-row max-xl:max-h-screen max-xl:overflow-y-scroll font-inter">
        <div className="flex w-full flex-1 flex-col gap-8 px-5 sm:px-8 py-6 lg:py-12 lg:px-20 xl:px-40 2xl:px-72 xl:max-h-screen xl:overflow-y-scroll">
          <header className="home-header">
            <HeaderBox
              type="title"
              title="Inbox"
              subtext="View your pending messages and notifications"
            />
          </header>
          <div className="flex justify-between items-center">
            <h2 className="py-2 text-18 font-semibold text-gray-900">
              Notifications and Messages
            </h2>
          </div>
          <section className="flex w-full flex-col gap-6">
            {/* Pass messages and markAsRead function to the InboxTable component */}
            <InboxTable messages={messages} markAsRead={markAsRead} />
          </section>
        </div>
      </section>
    </>
  );
};

export default Inbox;
