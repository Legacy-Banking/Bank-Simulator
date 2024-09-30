'use client';
import React, { useEffect, useState } from 'react';
import SearchBar from '@/components/SearchBar';
import { createClient } from '@/utils/supabase/client';
import { AccountsTable } from './AccountsTable';
import { Pagination } from '@/components/Pagination';
import PopUp from './PopUp';

const AccountsPage = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search Bar
  const [inputValue, setInputValue] = useState('');

  // Pagination
  const [page, setPage] = useState(1); // Initialize to page 1

  useEffect(() => {
    // Access query parameters after component mounts
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const pageParam = params.get('page');
      if (pageParam) {
        setPage(parseInt(pageParam));
      }
    }
  }, []);

  const rowsPerPage = 10;

  // Filter the accounts based on the input value
  const filteredAccounts = accounts.filter((account) =>
    (account.owner_username ?? '').toLowerCase().includes(inputValue.toLowerCase())
  );
  
  const uniqueAccounts = filteredAccounts.filter((account, index, self) =>
    index === self.findIndex((t) => t.owner === account.owner)
  );
  const totalPages = Math.ceil(uniqueAccounts.length / rowsPerPage);
  const indexOfLastTransaction = page * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;
  const currentAccounts = uniqueAccounts.slice(indexOfFirstTransaction, indexOfLastTransaction);

  // Fetching data from Supabase
  const supabase = createClient();
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from('account').select('*');

      if (error) {
        setError(error.message);
      } else {
        setAccounts(data || []);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []); // Run once when the component mounts



  // Pop-up states
  const [showUpdatePopUp, setShowUpdatePopUp] = useState(false);
  const [showDeletePopUp, setShowDeletePopUp] = useState(false);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className='flex flex-auto bg-gray-100'>
      <div className='px-8 py-6 flex flex-col flex-auto border-[#a0b1b1] border-x-2'>
        <div className='px-8 py-2 border-b-2 border-[#D7D7D7]'>
          <h1 className='text-3xl font-semibold leading-9'>Admin Dashboard</h1>
          <h1 className='text-base font-normal py-3 text-[#475467]'>View all account summaries</h1>
        </div>
        <div className='h-8'></div>
        <div className='px-8 py-2'>
          <div className='flex'>
            <div className='flex flex-1'>
              <h1 className="text-xl text-black font-semibold">Accounts</h1>
            </div>
            <SearchBar inputValue={inputValue} setInputValue={setInputValue} setPage={setPage}/>
          </div>
          <section className="flex w-full flex-col mt-6 bg-white-100 rounded-b-3xl">
            <AccountsTable
              accounts={currentAccounts}
              setShowUpdatePopUp={setShowUpdatePopUp}
              setShowDeletePopUp={setShowDeletePopUp}
            />

            {totalPages > 1 && (
              <div className="pt-4 mb-2 px-5 w-full border-t-2">
                <Pagination totalPages={totalPages} page={page} setPage={setPage} />
              </div>
            )}
          </section>
        </div>
      </div>
      {showUpdatePopUp && (
        <PopUp
          message="Successfully Updated."
          onClose={() => setShowUpdatePopUp(false)}
        />
      )}
      {showDeletePopUp && (
        <PopUp
          message="Successfully Deleted."
          onClose={() => setShowDeletePopUp(false)}
        />
      )}
    </div>
  );
};

export default AccountsPage;