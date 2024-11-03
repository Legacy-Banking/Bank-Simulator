"use client";

import React, { useState, useEffect } from "react";
import HeaderBox from "@/components/HeaderBox";
import { InboxTable } from "@/components/InboxTable";
import { inboxAction } from "@/lib/actions/inboxAction";
import { useAppSelector } from "@/store/hooks";
import { Pagination } from "@/components/Pagination"; // Import the Pagination component

const ITEMS_PER_PAGE = 10; // Number of messages per page

const Inbox = () => {
  const [loading, setLoading] = useState(true);
  const user_id = useAppSelector((state) => state.user.user_id)?.toString();
  const [messages, setMessages] = useState<Message[]>([]);
  const [page, setPage] = useState(1); // Track the current page
  const [totalPages, setTotalPages] = useState(1); // Track the total number of pages

  useEffect(() => {
    if (user_id) {
      inboxAction
        .getMessageByUserId(user_id)
        .then((data) => {
          setMessages(data);
          setTotalPages(Math.ceil(data.length / ITEMS_PER_PAGE)); // Calculate the total number of pages
        })
        .catch((error) => {
          console.error("Error fetching messages:", error);
        })
        .finally(() => {
          setLoading(false); // Set loading to false when data is fetched
        });
    }
  }, [user_id]);

  // Get the current page messages
  const currentPageMessages = messages.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

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
            <InboxTable messages={currentPageMessages} /> {/* Pass current page messages */}
            {totalPages > 1 && (
              <Pagination page={page} totalPages={totalPages} setPage={setPage} />
            )} {/* Show pagination only if there are multiple pages */}
          </section>
        </div>
      </section>
    </>
  );
};

export default Inbox;
