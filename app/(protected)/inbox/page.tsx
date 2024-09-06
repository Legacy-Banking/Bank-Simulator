"use client";

import React, { useState, useEffect } from 'react';
import HeaderBox from '@/components/HeaderBox';
import { InboxTable } from '@/components/InboxTable';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { accountAction } from '@/utils/accountAction';
import { useSearchParams } from 'next/navigation';
import AccountBox from '@/components/AccountBox';

const Inbox = () => {
  const [messages, setMessages] = useState<Message[]>([]);
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