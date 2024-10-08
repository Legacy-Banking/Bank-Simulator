"use client";

import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/store/hooks'; // To get the user's ID
import HeaderBox from '@/components/HeaderBox';
import { accountAction } from '@/lib/actions/accountAction'; // Import your account actions
import { billerAction } from '@/lib/actions/billerAction'; // Import your biller actions
import BPAYForm from '@/components/BPAYForm';

const BPAY = () => {
  const user_id = useAppSelector((state) => state.user.user_id); // Assuming user ID is stored in Redux
  const [accountsData, setAccountsData] = useState<Account[]>([]);
  const [billersData, setBillersData] = useState<Biller[]>([]); // Add state for billers
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch accounts and billers data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch accounts
        console.log("Fetching accounts for user ID:", user_id); // Debug: Check user ID
        const accounts = await accountAction.fetchAccountsbyUserId(user_id);
        console.log("Fetched accounts data:", accounts); // Debug: Check fetched accounts
        // Filter out accounts with type "savings" and "credit"
        const filteredAccounts = accounts.filter((account) => account.type !== 'savings' && account.type !== 'credit');
        setAccountsData(filteredAccounts); // Store filtered accounts

        // Fetch billers
        console.log("Fetching billers"); // Debug: Check biller fetch
        const billers = await billerAction.fetchBillersFromSavedBillers(user_id);
        console.log("Fetched billers data:", billers); // Debug: Check fetched billers
        setBillersData(billers);

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Unable to fetch data");
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    if (user_id) {
      fetchData();
    }
  }, [user_id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="spinner"></div> {/* Spinner shown while loading */}
      </div>
    );
  }

  if (error) {
    console.error("Error fetching accounts:", error); // Debug: Error state
    return <div>{error}</div>; // Display an error message if there's an issue fetching the accounts
  }

  console.log("Accounts data passed to TransferFundForm:", accountsData); // Debug: Check passed accounts
  console.log("Billers data passed to BPAYForm:", billersData); // Debug: Check passed billers


  return (
    <section className="flex flex-col bg-gray-25 md:max-h-screen py-6 lg:py-12 xl:py-16 px-8 lg:px-20 xl:px-40 2xl:px-72 xl:max-h-screen">
      <HeaderBox
        type="title"
        title="Bill Payment"
        subtext="Please provide any specific details or notes related to the bill payment"
      />

      <section className="size-full pt-5">
        {/* Pass the fetched accounts to the TransferFundForm component */}
        <BPAYForm accounts={accountsData} billers={billersData} />
      </section>

    </section>
  )
}

export default BPAY