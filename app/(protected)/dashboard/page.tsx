import HeaderBox from '@/components/HeaderBox'
import BalanceBox from '@/components/BalanceBox';
import AnimatedCounter from '@/components/AnimatedCounter';
import React from 'react'
import Link from 'next/link';

const Dashboard = () => {

    const loggedIn = { userName: 'Karen' };

    const account = {
        data1: {
            name: 'Personal Account',
            officialName: 'Karen\'s Personal Account',
            bsb: '123456',
            accNum: '123456789',
            balance: 475.50,
        },
        data2: {
            name: 'Saving Account',
            officialName: 'Karen\'s Saving Account',
            bsb: '654321',
            accNum: '987654321',
            balance: 2245.50,
        }
    };

    const totalBalance = account.data1.balance + account.data2.balance;

    return (
        <section className="flex w-full flex-row max-xl:max-h-screen max-xl:overflow-y-scroll font-inter">
            <div className="flex w-full flex-1 flex-col gap-8 px-5 sm:px-8 py-6 lg:py-12 lg:px-20 xl:px-40 2xl:px-72 xl:max-h-screen xl:overflow-y-scroll">

                <header className="home-header">
                    <HeaderBox
                        type="greeting"
                        title="Welcome"
                        user={loggedIn?.userName || 'Guest'}
                        subtext="View your account summaries"
                    />
                </header>

                {/* Divider */}
                <div className="border-t border-gray-200 my-1 sm:my-4"></div>

                <div className="subheader mt-2 sm:mt-4 mb-4 sm:mb-6">
                    <h2 className="text-20 lg:text-24 font-semibold text-blackText-50">Accounts:</h2>
                </div>

                {/* Personal Account */}
                <div className="space-y-6">
                    <div className="flex flex-col justify-between gap-4 rounded-lg border-y bg-yellow-gradient px-6 py-6 md:flex-row shadow-md">
                        <div className="flex flex-col gap-2">
                            <Link href="/transaction-history">
                                <h2 className="text-24 lg:text-26 font-bold text-blackText-50 hover:underline hover:text-white-100">
                                    {account?.data1.name}
                                </h2>
                            </Link>
                            <p className="text-14 text-blackText-100">
                                {account?.data1.officialName}
                            </p>
                            <p className="text-14 font-medium tracking-[1.1px] text-blackText-100">
                                BSB: {account?.data1.bsb} <span className="mx-4"> </span> Account Number: {account?.data1.accNum}
                            </p>
                        </div>

                        <div className='flex-center flex-col gap-2 rounded-md bg-white-100/20 px-8 py-2 text-blackText-100 border border-black'>
                            <div className="text-24 text-center font-bold">
                                <BalanceBox
                                    accounts={[]}
                                    currentBalance={account.data1.balance}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Saving Account */}
                <div className="space-y-6">
                    <div className="flex flex-col justify-between gap-4 rounded-lg border-y bg-blue-gradient px-6 py-6 md:flex-row shadow-md">
                        <div className="flex flex-col gap-2">
                            <Link href="/transaction-history">
                                <h2 className="text-24 lg:text-26 font-bold text-blackText-50 hover:underline hover:text-white-100">
                                    {account?.data2.name}
                                </h2>
                            </Link>
                            <p className="text-14 text-blackText-100">
                                {account?.data2.officialName}
                            </p>
                            <p className="text-14 font-semibold tracking-[1.1px] text-blackText-100">
                                BSB: {account?.data2.bsb} <span className="mx-4"> </span> Account Number: {account?.data2.accNum}
                            </p>
                        </div>

                        <div className='flex-center flex-col gap-2 rounded-md bg-white-100/20 px-8 py-2 text-blackText-50 border border-black'>
                            <div className="text-24 text-center font-bold">
                                <BalanceBox
                                    accounts={[]}
                                    currentBalance={account.data2.balance}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t-2 border-blackText-100 my-2 sm:my-4"></div>

                {/* Total Balance Section */}
                <div className="flex w-full justify-between items-center gap-4 p-4 sm:gap-6 sm:p-6">
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
