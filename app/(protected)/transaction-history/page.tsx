"use client";

import React, { useState, useEffect } from 'react';
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

// Import jsPDF and autoTable
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const TransactionHistory = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const accountId = searchParams.get('accountid');
  const pageFromUrl = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1; // Get page from URL or default to 1
  const user_id = useAppSelector((state) => state.user.user_id)?.toString();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [account, setAccount] = useState<Account>({} as Account);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(pageFromUrl); // Set initial page from URL
  const [loading, setLoading] = useState(false); // Add loading state
  const rowsPerPage = 10;

  const user =  useAppSelector(state => state.user);
  
  
  const dummy_data : Transaction[] = [
    {
      "id": "104",
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
      "id": "105",
      "description": "| Biller: Water Utility, Code: 5643, Ref: 6789",
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
      "id": "101",
      "description": "| Biller: Gas Service, Code: 1234, Ref: 5678",
      "amount": -45.67,
      "paid_on": new Date("2024-09-15T10:00:00.000Z"),
      "from_account": user_id,
      "from_account_username": user.user_name?user.user_name:'Guest',
      "to_account": "",
      "to_biller": "",
      "to_account_username": "Aidan",
      transaction_type: 'pay anyone'
    },
    {
      "id": "102",
      "description": "Funds Transfer to Savings",
      "amount": -500.00,
      "paid_on": new Date("2024-09-15T12:30:00.000Z"),
      "from_account": user_id,
      "from_account_username": user.user_name?user.user_name:'Guest',
      "to_account": "",
      "to_biller": "",
      "to_account_username": "Mary Jane",
      transaction_type: 'pay anyone'
    },
    {
      "id": "103",
      "description": "| Biller: Internet Service, Code: 8765, Ref: 4321",
      "amount": 79.99,
      "paid_on": new Date("2024-09-16T08:45:00.000Z"),
      "from_account": "",
      "from_account_username": "Alex",
      "to_account": user_id,
      "to_biller": "",
      "to_account_username": user.user_name?user.user_name:'Guest',
      transaction_type: 'pay anyone'
    },
  ];
  

  // Fetch accounts by user_id
  useEffect(() => {
    if (user_id) {
      setLoading(true); // Set loading to true when data is being fetched
      accountAction.fetchAccountsbyUserId(user_id).then((data) => {
        setAccounts(data);
        setLoading(false); // Set loading to false after fetching data
      }).catch((error) => {
        console.error('Error fetching accounts:', error);
        setLoading(false); // Set loading to false if there's an error
      });
    }
  }, [user_id]);

  // Fetch account and transactions when accountId or page changes
  useEffect(() => {
    if (accountId) {

      // Fetch account details
      accountAction.fetchAccountById(accountId).then((data) => {
        setAccount(data);
      }).catch((error) => {
        console.error('Error fetching account:', error);
      });

      // Fetch transaction history for the selected account
      transactionAction.getTransactionsByAccountId(accountId).then((data) => {
        const combinedData = (data || []).concat(dummy_data);
        setTransactions(combinedData);
        setLoading(false); // Set loading to false after fetching data
      }).catch((error) => {
        console.error('Error fetching transactions:', error);
        setLoading(false); // Set loading to false if there's an error
      });

      // Set page from URL
      setPage(pageFromUrl);
    }
  }, [accountId, pageFromUrl]); // Add pageFromUrl as a dependency

  // Handle account change in dropdown
  const handleAccountChange = (value: string) => {
    // Set loading to true before navigating
    setLoading(true);
    // Update URL with both accountId and page=1 in one step, avoiding intermediate renders
    router.push(`/transaction-history?accountid=${value}&page=1`);
  };

  const handleDownloadStatement = () => {
    // Create a new jsPDF document
    const doc = new jsPDF();

    // Add title
    doc.text('Transaction History', 14, 20);

    // Set smaller font size for the account details
    doc.setFontSize(12);

    // Add Account Information
    const accountType = capitalizeFirstLetter(account.type);
    const openingBalance = formatAmount(account.opening_balance);
    const currentBalance = formatAmount(account.balance);

    // Add account details to the PDF
    doc.text(`Account: ${accountType} Account`, 14, 30);
    doc.text(`Opening Balance: ${openingBalance}`, 14, 40);
    doc.text(`Current Balance: ${currentBalance}`, 14, 50);

    doc.setFontSize(10);

    // Get current date and time for the download timestamp
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-GB');
    const formattedTime = currentDate.toLocaleTimeString();


    // Add the timestamp, right-aligned
    const pageWidth = 210; // A4 page width in mm
    const marginRight = 14; // Right margin
    const textWidth = doc.getTextWidth(`Downloaded on: ${formattedDate} at ${formattedTime}`);
    const xPosition = pageWidth - textWidth - marginRight;

    doc.text(`Downloaded on: ${formattedDate} at ${formattedTime}`, xPosition, 55);


    // Add table with transactions
    const tableColumn = ['Transaction', 'Date', 'Amount'];
    const tableRows: any[] = [];

    // Loop through the transactions and add to tableRows
    transactions.forEach((transaction) => {
      const transactionData = [
        transaction.from_account_username,
        new Date(transaction.paid_on).toLocaleDateString('en-GB'),
        `${transaction.amount > 0 ? `+$${transaction.amount.toFixed(2)}` : `-$${Math.abs(transaction.amount).toFixed(2)}`}
`,
      ];
      tableRows.push(transactionData);
    });

    // Create the table in the PDF
    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 60,
    });

    // Save the PDF
    doc.save('transaction_history.pdf');
  };

  const totalPages = Math.ceil(transactions.length / rowsPerPage);
  const indexOfLastTransaction = page * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  return (

    <section className="flex w-full flex-col max-xl:max-h-screen font-inter">
      <div className="flex w-full flex-1 flex-col gap-8 px-5 sm:px-8 py-6 lg:py-12 lg:px-20 xl:px-40 2xl:px-72 xl:max-h-screen">
       

        {/* Show loading spinner when loading */}
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="spinner"></div> {/* Spinner shown while loading */}
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

            {/* Account Select Dropdown */}
            <div className="flex justify-end">
              <Select onValueChange={handleAccountChange} value={accountId ?? accounts[0]?.id}>
                <SelectTrigger className="w-52 bg-white-100 hover:bg-gray-100 ">
                  <span className="mx-auto text-center">{`${capitalizeFirstLetter(String(account.type))} Account`}</span> {/* Capitalizing the first letter */}
                </SelectTrigger>
                <SelectContent className="bg-white-100 ">
                  {accounts.map((acc) => (
                    <SelectItem key={acc.id} value={acc.id} className='hover:bg-gray-100'>
                      {`${capitalizeFirstLetter(String(acc.type))} Account`} {/* Capitalizing the first letter */}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <AccountBox account={account} />

            {/* Recent Transactions Title and Download Button */}
            <div className="flex justify-between items-center">
              <h2 className="py-2 text-18 font-semibold text-gray-900">
                Recent Transactions
              </h2>
              <Button onClick={handleDownloadStatement} className="ml-auto border text-14 font-normal border-gray-300 px-8 bg-white-100 hover:bg-gray-100">
                Download Statement
              </Button>
            </div>
            
            {/* Transaction History Table */}
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
}

export default TransactionHistory;
