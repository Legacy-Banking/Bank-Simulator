'use client'
import HeaderBox from '@/components/HeaderBox'
import AnimatedCounter from '@/components/AnimatedCounter';
import React, { useEffect, useState } from 'react'
import AccountBox from '@/components/AccountBox';
import { useAppSelector } from '@/app/store/hooks';
import { accountAction } from '@/utils/accountAction';
import UserState from '@/components/dev/UserState'
import BillForm from '@/components/dev/BillForm';


const Dashboard = () => {
    const user = useAppSelector(state => state.user);
    const user_id = (user.user_id)?.toString();
    const [accounts, setAccounts] = useState<Account[]>([]);
    useEffect(() => {
        if (user_id) {
            accountAction.fetchAccountsbyUserId(user_id).then((data) => {
                setAccounts(data);
            }).catch((error) => {
                console.error('Error fetching accounts:', error);
            });
        }
    }, [user_id]);

    const totalBalance = accounts.reduce((acc, account) => acc + (account.balance || 0), 0);

    return (
        <section className="flex w-full flex-row max-xl:max-h-screen font-inter">
            <div className="flex w-full flex-1 flex-col gap-8 px-5 sm:px-8 py-6 lg:py-12 lg:px-20 xl:px-40 2xl:px-72 xl:max-h-screen">
                <UserState />
                <BillForm />
                {/* Header */}
                <header className="home-header">
                    <HeaderBox
                        type="greeting"
                        title="Welcome"
                        user={user.user_name || 'Guest'}
                        subtext="View your account summaries"
                    />
                </header>

                {/* Divider */}
                <div className="border-t border-gray-200 my-1 sm:my-4"></div>

                <div className="subheader mt-2 sm:mt-4 mb-4 sm:mb-6">
                    <h2 className="text-20 lg:text-24 font-semibold text-blackText-50">Accounts:</h2>
                </div>

                {/* Accounts */}

                {accounts.map((account) => (
                    <AccountBox key={account.id} account={account} />
                ))}



                {/* Divider */}
                <div className="border-t-2 border-blackText-100 my-2 sm:my-4"></div>

                {/* Total Balance Section */}
                <div className="flex w-full justify-between items-center gap-4 p-4 sm:gap-6 sm:pt-6 pb-16">
                    <h2 className="text-24 lg:text-26 font-bold text-blackText-50">Total Balance</h2>
                    <div className="total-balance-amount text-right text-bold">
                        <AnimatedCounter amount={totalBalance} />
                    </div>
                </div>

            </div>
        </section>
    )
}

export default Dashboard
