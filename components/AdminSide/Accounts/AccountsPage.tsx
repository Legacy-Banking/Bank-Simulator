'use client';
import React, { useEffect, useState } from 'react';
import SearchBar from '@/components/SearchBar';
import { createClient } from '@/lib/supabase/client';
import { UsersTable } from './UsersTable';
import { Pagination } from '@/components/Pagination';
import PopUp from './PopUp';
import HeaderBox from '@/components/HeaderBox';

const UsersPage = () => {
  const [accounts, setUsers] = useState<Account[]>([]);
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
  const filteredUsers = accounts.filter((account) =>
    (account.owner_username ?? '').toLowerCase().includes(inputValue.toLowerCase())
  );

  const uniqueUsers = filteredUsers.filter((account, index, self) =>
    index === self.findIndex((t) => t.owner === account.owner)
  );
  const totalPages = Math.ceil(uniqueUsers.length / rowsPerPage);
  const indexOfLastTransaction = page * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;
  const currentUsers = uniqueUsers.slice(indexOfFirstTransaction, indexOfLastTransaction);

  // Fetching data from Supabase
  const supabase = createClient();
  const fetchUsers = async () => {
    const { data, error } = await supabase.from('account').select('*');

    if (error) {
      setError(error.message);
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  };
  useEffect(() => {

    fetchUsers();
  }, []); // Run once when the component mounts



  // Pop-up states
  const [showUpdatePopUp, setShowUpdatePopUp] = useState(false);
  const [showDeletePopUp, setShowDeletePopUp] = useState(false);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section className="flex w-full flex-row max-xl:max-h-screen font-inter">
      <div className="flex w-full flex-1 flex-col gap-8 px-4 py-6 lg:py-12 lg:px-10 xl:px-20 2xl:px-32 xl:max-h-screen">
        <header className="home-header border-b pb-10">
          <HeaderBox
            type="title"
            title={'Admin Dashboard'}
            subtext={'View all user and account summaries'}
          />
        </header>


        <div className='px-8 py-2'>
          <div className='flex'>
            <div className='flex flex-1'>
              <h1 className="text-xl text-black font-semibold">Users</h1>
            </div>
            <SearchBar inputValue={inputValue} setInputValue={setInputValue} />
          </div>
          <section className="flex w-full flex-col mt-6 bg-white-100 rounded-b-3xl">
            <UsersTable
              accounts={currentUsers}
              setShowUpdatePopUp={setShowUpdatePopUp}
              setShowDeletePopUp={setShowDeletePopUp}
              onEditStatus={fetchUsers}
            />

            {totalPages > 1 && (
              <div className="pt-4 mb-2 px-5 w-full border-t-2">
                <Pagination totalPages={totalPages} page={page} setPage={setPage} />
              </div>
            )}
          </section>
        </div>
      {/* </div> */}
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
    </section>
  )
};

export default UsersPage;
