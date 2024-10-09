import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import AddFundsSheet from './AdminSide/Accounts/AddFundsSheet';

// Define props for the component
type AdminAccountBoxProps = {
    account: Account;
    refreshAccounts: () => Promise<void>; // Accept the refresh callback as a prop
};

const AdminAccountBox: React.FC<AdminAccountBoxProps> = ({ account, refreshAccounts }) => {
    const variant = account.type;

    // Define box style based on the account type
    const boxStyle =
        variant === 'personal'
            ? 'bg-[#52A1E1] text-blackText-50'
            : variant === 'savings'
                ? 'bg-[#FBD978] text-blackText-50'
                : 'bg-[#D1B7E5] text-blackText-50';

    return (
        <div
            className={cn(
                'flex items-center justify-between p-6 rounded-lg shadow-lg',
                boxStyle
            )}
        >
            <div>
                <h2 className='text-xl font-inter font-semibold'>
                    {(variant ? variant.charAt(0).toUpperCase() + variant.slice(1) : "Unknown")}
                </h2>
            </div>
            <div className="flex items-center gap-8">
                <span className="text-xl font-semibold">
                    ${account.balance?.toFixed(2)}
                </span>

                <AddFundsSheet toBank={account} refreshAccounts={refreshAccounts} />

            </div>
        </div>
    );
};

export default AdminAccountBox;