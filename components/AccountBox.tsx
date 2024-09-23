import React from 'react';
import { useRouter } from 'next/navigation';
import BalanceBox from './BalanceBox';

type AccountBoxProps = {
    account: Partial<Account>;
}

const formatBSB = (bsb: string = ''): string => {
    return bsb.slice(0, 3) + '-' + bsb.slice(3, 6);
};

const formatAccountNumber = (acc: string = ''): string => {
    return acc.slice(0, 2) + '-' + acc.slice(2, 5) + '-' + acc.slice(5, 9);
};

const AccountBox: React.FC<AccountBoxProps> = ({ account }) => {
    const router = useRouter();
    const variant = account.type === 'savings' ? 'primary' : 'secondary';
    const boxStyle = variant === 'primary'
        ? 'bg-gradient-to-r from-yellow-100 to-yellow-500'  // Lighter yellow to darker yellow
        : 'bg-gradient-to-r from-[#4C97D1] to-[#1A70B8]';     // Lighter blue to darker blue

    const textColor = variant === 'primary'
        ? 'text-blackText-50 hover:text-white-100'
        : 'text-blackText-50 hover:text-white-100';

    const parseUpperCase = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    const accountType = parseUpperCase(account.type || '');

    const handleLinkClick = () => {
        router.push(`/transaction-history?accountid=${account.id}`);
    };

    return (
        <div className={`space-y-6 ${boxStyle} rounded-lg shadow-md`}>
            <div className='flex flex-col justify-between gap-4 rounded-lg border-y px-6 py-6 md:flex-row'>
                <div className="flex flex-col gap-2">
                    <h2
                        className={`text-24 lg:text-3xl font-bold ${textColor} hover:underline cursor-pointer`}
                        onClick={handleLinkClick}
                    >
                        {accountType} Account
                    </h2>
                    <p className={`text-lg`}>
                        {account?.owner_username}'s {account?.type} Account
                    </p>
                    <p className="text-lg font-medium tracking-[1.1px] text-blackText-100">
                        BSB: {account?.bsb ? formatBSB(account.bsb.toString()) : ''} <span className="mx-4"> </span> Account Number: {account?.acc ? formatAccountNumber(account.acc.toString()) : ''}
                    </p>
                </div>

                <div className='flex-center flex-col gap-2 rounded-md bg-white-100/20 px-8 py-2 text-blackText-100 border border-black'>
                    <div className="text-2xl text-center font-bold">
                        <BalanceBox
                            accounts={[]}
                            currentBalance={account.balance || 0}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AccountBox;
