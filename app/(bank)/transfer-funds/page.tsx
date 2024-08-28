import React from 'react';
import HeaderBox from '@/components/HeaderBox';
import TransferFundForm from '@/components/TransferFundsForm';

// Assuming accountsData is fetched or passed as props
const accountsData = [
  // Example data structure. Replace with actual data fetching or prop-passing logic.
  { id: '1', name: 'Personal', currentBalance: 400 },
  { id: '2', name: 'Savings', currentBalance: 2000 },
  // Add more accounts as needed
];

const TransferFunds = () => {
  return (
    <section className="no-scrollbar flex flex-col overflow-y-scroll bg-gray-25 md:max-h-screen py-6 lg:py-12 xl:py-16 px-8 lg:px-20 xl:px-40 2xl:px-72 xl:max-h-screen">
      <HeaderBox 
        title="Transfer Funds"
        subtext="Please provide any specific details or notes related to the funds transfer"
      />

      <section className="size-full pt-5">
        <TransferFundForm accounts={accountsData} />
      </section>
    </section>
  );
};

export default TransferFunds;
