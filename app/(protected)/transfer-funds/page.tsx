"use client";

import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/app/store/hooks'; // To get the user's ID
import HeaderBox from '@/components/HeaderBox';
import TransferFundForm from '@/components/TransferFundsForm';
import { accountAction } from '@/utils/accountAction'; // Import your account actions

const TransferFunds = () => {
  const user_id = useAppSelector((state) => state.user.user_id); // Assuming user ID is stored in Redux
  const [accountsData, setAccountsData] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch accounts data
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        console.log("Fetching accounts for user ID:", user_id); // Debug: Check user ID

        const data = await accountAction.fetchAccountsbyUserId(user_id); // Use fetchAccountsbyUserId method

        console.log("Fetched accounts data:", data); // Debug: Check fetched accounts

        setAccountsData(data); // Store fetched accounts
      } catch (err) {
        console.error("Error fetching accounts:", err);
        setError("Unable to fetch accounts");
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    if (user_id) {
      fetchAccounts();
    }
  }, [user_id]);

  // if (loading) {
  //   return <div>Loading...</div>; // Display a loading message while fetching accounts
  // }

  if (error) {
    console.error("Error fetching accounts:", error); // Debug: Error state
    return <div>{error}</div>; // Display an error message if there's an issue fetching the accounts
  }

  console.log("Accounts data passed to TransferFundForm:", accountsData); // Debug: Check passed accounts

  return (
    <section className="no-scrollbar flex flex-col overflow-y-scroll bg-gray-25 md:max-h-screen py-6 lg:py-12 xl:py-16 px-8 lg:px-20 xl:px-40 2xl:px-72 xl:max-h-screen">
      <HeaderBox 
        title="Transfer Funds"
        subtext="Please provide any specific details or notes related to the funds transfer"
      />

      <section className="size-full pt-5">
        {/* Pass the fetched accounts to the TransferFundForm component */}
        <TransferFundForm accounts={accountsData} />
      </section>
    </section>
  );
};

export default TransferFunds;
