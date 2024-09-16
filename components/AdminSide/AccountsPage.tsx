"use client"
import React from 'react'
import SearchBar from '@/components/SearchBar'
import AdminSideBar from '@/components/AdminSide/AdminSideBar'
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

type User = {
  id: number;
  accountType: string;
  balance: number;
  owner: string;
  opening_balance: number;
};

const AccountsPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const supabase = createClient();
  useEffect(() => {
    const fetchUsers = async () => {
        const { data, error } = await supabase
            .from('account')
            .select('*');

        if (error) {
            setError(error.message);
        } else {
            setUsers(data || []);
        }
        setLoading(false);
    };

    fetchUsers();
}, []); // Empty dependency array ensures this runs once when the component mounts

if (loading) return <p>Loading...</p>;
if (error) return <p>Error: {error}</p>;

  return (
    <div className='flex flex-auto'>
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

          <div className='border-2 border-black mt-6'> Table
            <ul>
              {users.map((user) => (
                  <li key={user.id}> {user.owner} {user.accountType} {user.id}</li> // Adjust according to your table schema
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
    
  )
}

export default AccountsPage