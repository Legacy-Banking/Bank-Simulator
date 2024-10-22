"use client";

import AdminSideBar from '@/components/AdminSide/AdminSideBar'
import { useAppSelector } from '@/store/hooks';
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import BankNavbar from '@/components/BankNavbar';
import { accountAction } from '@/lib/actions/accountAction';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const userRole = useAppSelector(state => state.user.user_role);
  const router = useRouter();
  const user_id = useAppSelector(state => state.user.user_id);
  const [personalAccount, setPersonalAccount] = useState(null); // Store personal account

  if (userRole !== 'admin') {
    router.push('/'); // Redirect to home if not admin
  }

  // Fetch the personal account using the utility function
  const fetchUserPersonalAccount = async () => {
    try {
      const personalAccountData = await accountAction.fetchPersonalAccountByUserId(user_id);
      setPersonalAccount(personalAccountData);
    } catch (error) {
      console.error('Error fetching personal account:', error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (user_id) {
        await fetchUserPersonalAccount(); // Fetch personal account after user ID is set
      }
    };
    fetchUserData();

  }, [user_id]); // Watch for changes in user_id

  return (
    <div className="min-h-screen flex flex-col">
      <BankNavbar personalAccount={personalAccount}/>
        <main className="flex h-screen w-full font-inter">
            <AdminSideBar/>
            {children}
        </main>
    </div>
  )
}

export default AdminLayout;


