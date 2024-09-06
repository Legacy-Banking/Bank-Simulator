"use client";

import React, { useState, useEffect } from 'react';
import HeaderBox from '@/components/HeaderBox';
import { TransactionsTable } from '@/components/TransactionsTable';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { accountAction } from '@/utils/accountAction';
import { transactionAction } from '@/utils/transactionAction';
import { useSearchParams } from 'next/navigation';
import AccountBox from '@/components/AccountBox';
import DebitCard from '@/components/DebitCard';

const Cards = () => {
  const accountId = useSearchParams().get('accountid');
  const [account, setAccount] = useState<Account>({} as Account);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  useEffect(() => {
    if (accountId) {
      accountAction.fetchAccountById(accountId).then((data) => {
        setAccount(data);
      }).catch((error) => {
        console.error('Error fetching account:', error);
      });
      transactionAction.getTransactionsByAccountId(accountId).then((data) => {
        setTransactions(data);
      }).catch((error) => {
        console.error('Error fetching transactions:', error);
      });
    }

  }, [accountId]);
  const handleAccountChange = (value: 'data1' | 'data2') => {
  };

//   Static data
  const type = "Mastercard";
  const name = "Karen Clark";
  const cardNumber = 1234123412341234;
  const expirationDate: Date = new Date("2027-06-01");
  const maxSpending = 5000;
  const spending = 2840.40;

  return (
    <section className="flex w-full flex-row max-xl:max-h-screen max-xl:overflow-y-scroll font-inter">
        <div className="flex w-full flex-1 flex-col gap-8 px-5 sm:px-8 py-6 lg:py-12 lg:px-20 xl:px-40 2xl:px-72 xl:max-h-screen xl:overflow-y-scroll">

            <header className="home-header">
                <HeaderBox
                    type="title"
                    title="Your cards"
                    subtext="Effortlessly Manage Your Available Cards and Activities"
                />
            </header>


            <div className="subheader mt-2 sm:mt-4 mb-4 sm:mb-6">
                <h2 className="text-20 lg:text-24 font-semibold text-blackText-50">Cards:</h2>
            </div>

            <DebitCard 
            type={type}
            name={name} 
            cardNumber={cardNumber}
            expirationDate={expirationDate}
            maxSpending={maxSpending}
            spending={spending}></DebitCard>
        </div>
    
    </section>
  );
}

export default Cards;
