"use client";

import React, { useState, useEffect } from 'react';
import HeaderBox from '@/components/HeaderBox';
import { InboxTable } from '@/components/InboxTable';
import { inboxAction } from '@/utils/inboxAction';
import { useAppSelector } from '@/app/store/hooks';


const Inbox = () => {
  const [loading, setLoading] = useState(true);
  const user_id = useAppSelector((state) => state.user.user_id)?.toString();
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (user_id) {
      inboxAction.getMessageByUserId(user_id).then((data) => {
        setMessages(data);
      }).catch((error) => {
        console.error('Error fetching messages:', error);
      })
      .finally(() => {
        setLoading(false); // Set loading to false when data is fetched
      });
    }
  }, [user_id]);

  return (
    
    <><section className="flex w-full flex-row max-xl:max-h-screen max-xl:overflow-y-scroll font-inter">
      <div className="flex w-full flex-1 flex-col gap-8 px-5 sm:px-8 py-6 lg:py-12 lg:px-20 xl:px-40 2xl:px-72 xl:max-h-screen xl:overflow-y-scroll">
        <header className="home-header">
          <HeaderBox
            type="title"
            title="Inbox"
            subtext="View your pending messages and notifications" />
        </header>
        <div className="flex justify-between items-center">
          <h2 className="py-2 text-18 font-semibold text-gray-900">
            Notifications and Messages
          </h2>
      </div>
        <section className="flex w-full flex-col gap-6">
          <InboxTable messages={messages} />
        </section>
      </div> 
    </section>
    </>
    
  );
}


export default Inbox