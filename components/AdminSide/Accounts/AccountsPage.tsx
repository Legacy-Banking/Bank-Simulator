"use client"
import React from 'react'
import SearchBar from '@/components/SearchBar'
import AdminSideBar from '@/components/AdminSide/AdminSideBar'
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { AccountsTable } from './AccountsTable';
import { useSearchParams } from 'next/navigation';
import { Pagination } from '@/components/Pagination';


const AccountsPage = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const rowsPerPage = 10;
  const pageFromUrl = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1; // Get page from URL or default to 1
  const [page, setPage] = useState(pageFromUrl); // Set initial page from URL

  const totalPages = Math.ceil(accounts.length / rowsPerPage);
  const indexOfLastTransaction = page * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;
  const currentAccounts = accounts.slice(indexOfFirstTransaction, indexOfLastTransaction);

  const supabase = createClient();
  useEffect(() => {
    const fetchUsers = async () => {
        const { data, error } = await supabase
            .from('account')
            .select('*');

        if (error) {
            setError(error.message);
        } else {
            setAccounts(data || []);
        }
        setLoading(false);
    };

    fetchUsers();
}, []); // Empty dependency array ensures this runs once when the component mounts

if (loading) return <p>Loading...</p>;
if (error) return <p>Error: {error}</p>;

  return (
    <div className='flex flex-auto bg-gray-100'>
    {/* <AdminSideBar /> */}
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
            <SearchBar></SearchBar>

          </div>
          <section className="flex w-full flex-col mt-6 bg-white-100 rounded-b-3xl">
              <AccountsTable accounts={currentAccounts} />

              {totalPages > 1 && (
                <div className="pt-4 mb-2 px-5 w-full border-t-2">
                  <Pagination totalPages={totalPages} page={page} setPage={setPage} />
                </div>
              )}
            </section>
        </div>
      </div>
    </div>
    
  )
}

export default AccountsPage