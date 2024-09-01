import React from 'react'
import Link from 'next/link'
import BalanceBox from './BalanceBox'
import { Account } from '@/types/Account'

type AccountBoxProps = {
    account: Partial<Account>;
}

const AccountBox: React.FC<AccountBoxProps> = ({ account }) => {
    const variant = account.type === 'savings' ? 'primary' : 'secondary';
    const boxStyle = variant === 'primary'
        ? 'bg-yellow-gradient'
        : 'bg-blue-gradient';

    const textColor = variant === 'primary'
        ? 'text-blackText-50 hover:text-white-100'
        : 'text-white-100 hover:text-blackText-50';

    const parseUpperCase = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    const accountType = parseUpperCase(account.type || '');

    return (
        <div className={`space-y-6 ${boxStyle} rounded-lg shadow-md`}>
            <div className='flex flex-col justify-between gap-4 rounded-lg border-y px-6 py-6 md:flex-row'>
                <div className="flex flex-col gap-2">
                    <Link href="/transaction-history">
                        <h2 className={`text-24 lg:text-26 font-bold ${textColor} hover:underline`}>
                            {accountType} Account
                        </h2>
                    </Link>
                    <p className={`text-14 ${textColor}`}>
                        Karen's {account?.type} Account
                    </p>
                    <p className="text-14 font-medium tracking-[1.1px] text-blackText-100">
                        BSB: {account?.bsb} <span className="mx-4"> </span> Account Number: {account?.acc}
                    </p>
                </div>

                <div className='flex-center flex-col gap-2 rounded-md bg-white-100/20 px-8 py-2 text-blackText-100 border border-black'>
                    <div className="text-24 text-center font-bold">
                        <BalanceBox
                            accounts={[]}
                            currentBalance={account.balance || 0}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountBox;
