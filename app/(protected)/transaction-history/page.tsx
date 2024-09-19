"use client";

import React, { useState, useEffect, Suspense } from 'react';
import HeaderBox from '@/components/HeaderBox';
import { TransactionsTable } from '@/components/TransactionsTable';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { accountAction } from '@/utils/accountAction';
import { transactionAction } from '@/utils/transactionAction';
import { useSearchParams, useRouter } from 'next/navigation';
import AccountBox from '@/components/AccountBox';
import { Pagination } from '@/components/Pagination';
import { useAppSelector } from '@/app/store/hooks';
import { capitalizeFirstLetter, formatAmount } from '@/lib/utils';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const TransactionHistoryContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const accountId = searchParams.get('accountid');
  const pageFromUrl = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
  const user_id = useAppSelector((state) => state.user.user_id)?.toString();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [account, setAccount] = useState<Account>({} as Account);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(pageFromUrl);
  const [loading, setLoading] = useState(false);
  const rowsPerPage = 10;

  const user = useAppSelector(state => state.user);  
  
  const dummy_data : Transaction[] = [
    {
      "id": "1",
      "description": "Rent Payment",
      "amount": 1200.00,
      "paid_on": new Date("2024-09-16T14:00:00.000Z"),
      "from_account": "",
      "from_account_username": "Jack Smith",
      "to_account": user_id,
      "to_biller": "",
      "to_account_username": user.user_name?user.user_name:'Guest',
      transaction_type: 'pay anyone'
    },
    {
      "id": "2",
      "description": "Food for lunch",
      "amount": 25.50,
      "paid_on": new Date("2024-09-17T09:15:00.000Z"),
      "from_account": "",
      "from_account_username": "Linda Rose",
      "to_account": user_id,
      "to_biller": "",
      "to_account_username": user.user_name?user.user_name:'Guest',
      transaction_type: 'pay anyone'
    },
    {
      "id": "3",
      "description": "| Biller: Gas Service, Code: 1234, Ref: 567834512452",
      "amount": -45.67,
      "paid_on": new Date("2024-09-15T10:00:00.000Z"),
      "from_account": user_id,
      "from_account_username": user.user_name?user.user_name:'Guest',
      "to_account": "",
      "to_biller": "100",
      "to_account_username": "Gas Service",
      transaction_type: 'bpay'
    },
    {
      "id": "4",
      "description": "Funds Transfer to Savings",
      "amount": -500.00,
      "paid_on": new Date("2024-09-15T12:30:00.000Z"),
      "from_account": user_id,
      "from_account_username": user.user_name?user.user_name:'Guest',
      "to_account": "100",
      "to_biller": "",
      "to_account_username": "Jon Doe",
      transaction_type: 'pay anyone'
    },
    {
      "id": "5",
      "description": "| Biller: Internet Service, Code: 8765, Ref: 432132861542",
      "amount": -79.99,
      "paid_on": new Date("2024-09-14T08:45:00.000Z"),
      "from_account": user_id,
      "from_account_username": user.user_name?user.user_name:'Guest',
      "to_account": "",
      "to_biller": "101",
      "to_account_username": "Internet Service",
      transaction_type: 'bpay'
    },
  ];
  
  // Fetch accounts by user_id
  useEffect(() => {
    if (user_id) {
      setLoading(true);
      accountAction.fetchAccountsbyUserId(user_id).then((data) => {
        setAccounts(data);
        setLoading(false);
      }).catch((error) => {
        console.error('Error fetching accounts:', error);
        setLoading(false);
      });
    }
  }, [user_id]);

  // Fetch account and transactions when accountId or page changes
  useEffect(() => {
    if (accountId) {
      accountAction.fetchAccountById(accountId).then((data) => {
        setAccount(data);
      }).catch((error) => {
        console.error('Error fetching account:', error);
      });

      transactionAction.getTransactionsByAccountId(accountId).then((data) => {
        const combinedData = (data || []).concat(dummy_data);
        setTransactions(combinedData);
        setLoading(false); // Set loading to false after fetching data
      }).catch((error) => {
        console.error('Error fetching transactions:', error);
        setLoading(false);
      });

      setPage(pageFromUrl);
    }
  }, [accountId, pageFromUrl]);

  const handleAccountChange = (value: string) => {

  const currentPage = pageFromUrl;
  // Reset the page to 1 when account is changed or even when selecting the same account
  if (String(value) === String(accountId) && currentPage === 1) {
    // If the account is the same and already on page 1, do nothing
    return;
  }

  setLoading(true);
  router.push(`/transaction-history?accountid=${value}&page=1`);

  };

  const handleDownloadStatement = () => {
    const doc = new jsPDF();
    doc.text('Transaction History', 14, 20);
    doc.setFontSize(12);
    const accountType = capitalizeFirstLetter(account.type);
    const openingBalance = formatAmount(account.opening_balance);
    const currentBalance = formatAmount(account.balance);

    doc.text(`Account: ${accountType} Account`, 14, 30);
    doc.text(`Opening Balance: ${openingBalance}`, 14, 40);
    doc.text(`Current Balance: ${currentBalance}`, 14, 50);

    doc.setFontSize(10);
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-GB');
    const formattedTime = currentDate.toLocaleTimeString();
    const pageWidth = 210;
    const marginRight = 14;
    const textWidth = doc.getTextWidth(`Downloaded on: ${formattedDate} at ${formattedTime}`);
    const xPosition = pageWidth - textWidth - marginRight;

    doc.text(`Downloaded on: ${formattedDate} at ${formattedTime}`, xPosition, 55);

    const tableColumn = ['Transaction', 'Date', 'Amount'];
    const tableRows: any[] = [];
    transactions.forEach((transaction) => {
      const transactionData = [
        transaction.amount > 0 
        ? transaction.from_account_username : transaction.to_account_username, 
        new Date(transaction.paid_on).toLocaleDateString('en-GB'),
        `${transaction.amount > 0 ? `+$${transaction.amount.toFixed(2)}` : `-$${Math.abs(transaction.amount).toFixed(2)}`}`,
      ];
      tableRows.push(transactionData);
    });

    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 60,
    });

    doc.save('transaction_history.pdf');
  };

  const totalPages = Math.ceil(transactions.length / rowsPerPage);
  const indexOfLastTransaction = page * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  return (
    <section className="flex w-full flex-col max-xl:max-h-screen font-inter">
      <div className="flex w-full flex-1 flex-col gap-8 px-5 sm:px-8 py-6 lg:py-12 lg:px-20 xl:px-40 2xl:px-72 xl:max-h-screen">
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            <header className="home-header">
              <HeaderBox
                type="title"
                title="Transaction History"
                subtext="View and or Download all of your recent transactions"
              />
            </header>

            <div className="flex justify-end">
              <Select onValueChange={handleAccountChange} value={accountId ?? accounts[0]?.id}>
                <SelectTrigger className="w-52 bg-white-100 hover:bg-gray-100">
                  <span className="mx-auto text-center">{`${capitalizeFirstLetter(String(account.type))} Account`}</span>
                </SelectTrigger>
                <SelectContent className="bg-white-100">
                  {accounts.map((acc) => (
                    <SelectItem key={acc.id} value={acc.id} className='hover:bg-gray-100'>
                      {`${capitalizeFirstLetter(String(acc.type))} Account`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <AccountBox account={account} />

            <div className="flex justify-between items-center">
              <h2 className="py-2 text-18 font-semibold text-gray-900">
                Recent Transactions
              </h2>
              <Button onClick={handleDownloadStatement} className="ml-auto border text-14 font-normal border-gray-300 px-8 bg-white-100 hover:bg-gray-100">
                Download Statement
              </Button>
            </div>

            <section className="flex w-full flex-col gap-6">
              <TransactionsTable transactions={currentTransactions} />
              {totalPages > 1 && (
                <div className="my-4 w-full pb-2">
                  <Pagination totalPages={totalPages} page={page} setPage={setPage} />
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </section>
  );
};

// Wrap in Suspense on export
const TransactionHistory = () => (
  <Suspense fallback={<div>Loading transaction history...</div>}>
    <TransactionHistoryContent />
  </Suspense>
);

export default TransactionHistory;
