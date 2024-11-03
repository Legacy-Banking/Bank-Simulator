'use client';
import React, { useEffect, useState } from 'react';
import SearchBar from '@/components/SearchBar';
import { createClient } from '@/lib/supabase/client';
import { UsersTable } from './UsersTable';
import { Pagination } from '@/components/Pagination';
import PopUp from './PopUp';
import HeaderBox from '@/components/HeaderBox';
import { userAction } from '@/lib/actions/userAction';

const UsersPage = () => {
  const [accounts, setUsers] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [usersTest, setUserss] = useState<User[]>([]);
  // Search Bar
  const [inputValue, setInputValue] = useState('');

  // Pagination
  const [page, setPage] = useState(1); // Initialize to page 1

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const pageParam = params.get('page');
      if (pageParam) {
        setPage(parseInt(pageParam));
      }
    }
  }, []);

  const rowsPerPage = 10;
  const listAndDeleteOldUsers = async () => {
    try {
      const oldUsers = await userAction.listOldUsers();
      for (const user of oldUsers) {
        await deleteUser(user.user_id);
      }
      fetchUsers();
    } catch (error) {
      console.error("Error listing or deleting old users:", error);
    }
  };
  const deleteUser = async (userId: string) => {
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) throw new Error(error.message);
  };

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

  const supabase = createClient();
  const fetchUsers = async () => {
    const { data, error } = await supabase.from('account').select('*');
    const testUsers = await userAction.listOldUsers();
    setUserss(testUsers);
    if (error) {
      setError(error.message);
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const [showUpdatePopUp, setShowUpdatePopUp] = useState(false);
  const [showDeletePopUp, setShowDeletePopUp] = useState(false);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section
      data-testid={'accounts-page'}
      className="flex w-full flex-row max-xl:max-h-screen font-inter">
      <div className="flex w-full flex-1 flex-col gap-8 px-4 py-6 lg:py-12 lg:px-10 xl:px-20 2xl:px-32 xl:max-h-screen">
        <header className="home-header border-b pb-10">
          <HeaderBox
            type="title"
            title={'Admin Dashboard'}
            subtext={'View all user and account summaries'}
          />
        </header>

        <div className='px-8 py-2'>
          <div className='flex items-center'>
            <div className='flex flex-1'>
              <h1 className="text-xl text-black font-semibold">Users</h1>
            </div>
            <SearchBar inputValue={inputValue} setInputValue={setInputValue} />
            <button
              onClick={listAndDeleteOldUsers}
              className="ml-4 px-4 py-2 bg-red-500 text-white-100 rounded-md hover:bg-red-600"
            >
              Delete inactive Users
            </button>
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
        <div className="bg-slate-400">
          {usersTest.map(user => {
            const userAccount = accounts.find(account => account.owner === user.user_id);

            return (
              <option key={user.user_id} value={user.user_id}>
                {userAccount ? (
                  <>
                    {userAccount.owner_username} - {user.last_sign_in_at}
                  </>
                ) : (
                  <>
                    No account found for {user.user_id}
                  </>
                )}
              </option>
            );
          })}
        </div>
      </div>
    </section>
  )
};

export default UsersPage;
