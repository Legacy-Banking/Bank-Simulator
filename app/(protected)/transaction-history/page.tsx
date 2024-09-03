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

const TransactionHistory = () => {
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

  const handleDownloadStatement = () => {
    console.log('Downloading statement for');
  };

  return (
    <section className="flex w-full flex-row max-xl:max-h-screen max-xl:overflow-y-scroll font-inter">
      <div className="flex w-full flex-1 flex-col gap-8 px-5 sm:px-8 py-6 lg:py-12 lg:px-20 xl:px-40 2xl:px-72 xl:max-h-screen xl:overflow-y-scroll">

        <header className="home-header">
          <HeaderBox
            type="title"
            title="Transaction History"
            subtext="View and or Download all of your recent transactions"
          />
        </header>

        {/* Account Select Dropdown */}
        <div className="flex justify-end">
          <Select onValueChange={handleAccountChange} defaultValue="data1">
            <SelectTrigger className="w-48">
              <span>{account.owner}</span>
            </SelectTrigger>
            <SelectContent className="bg-white-200">
              <SelectItem value="data1">Personal Account</SelectItem>
              <SelectItem value="data2">Savings Account</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <AccountBox account={account} />

        {/* Recent Transactions Title and Download Button */}
        <div className="flex justify-between items-center">
          <h2 className="py-2 text-18 font-semibold text-gray-900">
            Recent Transactions
          </h2>
          <Button onClick={handleDownloadStatement} className="ml-auto border border-gray-500 px-8">
            Download Statement
          </Button>
        </div>

        {/* Transaction History Table */}
        <section className="flex w-full flex-col gap-6">
          <TransactionsTable transactions={transactions} />
        </section>

      </div>

    </section>
  );
}

export default TransactionHistory;
