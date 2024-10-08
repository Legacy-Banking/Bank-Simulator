import React from 'react';
import { useRouter } from 'next/navigation';
import BalanceBox from './BalanceBox';
import { Tooltip } from 'react-tooltip';

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
    const variant = account.type;
    const tooltipId = `${account?.type}-account-tooltip`;

    const boxStyle = variant === 'personal'
        ? 'bg-gradient-to-r from-[#4C97D1] to-[#1A70B8]'  // Blue gradient for personal
        : variant === 'savings'
            ? 'bg-gradient-to-r from-yellow-100 to-yellow-500'  // Yellow gradient for savings
            : variant === 'credit'
                ? 'bg-gradient-to-r from-purple-200 to-purple-600' // Purple gradient for credit
                : 'bg-gradient-to-r from-[#4C97D1] to-[#1A70B8]';

    const textColor = variant === 'personal'
        ? 'text-blackText-50 hover:text-white-100'
        : variant === 'savings'
            ? 'text-blackText-50 hover:text-white-100'
            : 'text-text-blackText-50 hover:text-white-100';

    const parseUpperCase = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    const accountType = parseUpperCase(account.type || '');

    const handleLinkClick = () => {
        router.push(`/transaction-history?accountid=${account.id}`);
    };

    const availableCredit = account.balance || 0;  // Assuming balance field represents available credit for credit accounts
    const creditUsed = (account.opening_balance || 0) - availableCredit; // opening_balance is assumed to be the total available credit limit

    return (
        <div className={`space-y-6 ${boxStyle} rounded-lg shadow-md`}>
            <div className='flex flex-col justify-between gap-4 rounded-lg border-y px-6 py-6 md:flex-row'>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <h2
                            className={`text-24 lg:text-3xl font-bold ${textColor} hover:underline cursor-pointer`}
                            onClick={handleLinkClick}
                            data-tooltip-id={tooltipId}  // Attach the tooltip to the icon
                        >
                            {accountType} Account
                        </h2>


                    </div>

                    <div>
                        <p className="text-lg">
                            {account?.owner_username}'s {account?.type} Account
                        </p>
                    </div>

                    <p className="text-lg font-medium tracking-[1.1px] text-blackText-100"
                        data-tooltip-id='bsb-acc-tip'>
                        {account.type !== 'credit' && (
                            <>
                                BSB: {account?.bsb ? formatBSB(account.bsb.toString()) : ''} 
                                <span className="mx-4"> </span>
                            </>
                        )}
                        Account Number: {account?.acc ? formatAccountNumber(account.acc.toString()) : ''}
                    </p>

                </div>

                <div className='flex-center flex-col gap-2 rounded-md bg-white-100/20 px-8 py-2 text-blackText-100 border border-black'>
                    <div className="text-2xl text-center font-bold">
                    <BalanceBox
                            currentBalance={availableCredit}
                            creditUsed={creditUsed}
                            isCreditAccount={account.type === 'credit'}
                        />
                    </div>
                </div>
            </div>

            {/* Tooltip configuration */}
            <Tooltip id={tooltipId} place="top" className="max-w-sm text-sm bg-gray-800 text-white p-2 rounded shadow-lg z-50">
                {account?.type === 'savings' && (
                    <p>
                        <strong>SAVINGS ACCOUNT:</strong> Ideal for storing the majority of your funds. Transfers are limited to personal accounts, and it accumulates monthly interest.
                    </p>
                )}
                {account?.type === 'personal' && (
                    <p>
                        <strong>PERSONAL ACCOUNT:</strong> The primary account for daily transactions, including BPAY and Pay Anyone payments.
                    </p>
                )}
                {account?.type === 'credit' && (
                    <p>
                        <strong>CREDIT ACCOUNT:</strong> To view credit available and used for credit card transactions. Carries an interest fee if the balance is not repaid within the due period.
                    </p>
                )}
            </Tooltip>
            <Tooltip id="bsb-acc-tip" place="top" className="max-w-sm text-sm bg-gray-800 text-white p-2 rounded shadow-lg z-50">
                <p>
                    The BSB and Account Number are essential for making and receiving payments. They are unique identifiers for your bank account.
                </p>
            </Tooltip>

        </div>
    );
}

export default AccountBox;
