import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Define props for the component
type AdminAccountBoxProps = {
    account: Partial<Account>;
};

const AdminAccountBox: React.FC<AdminAccountBoxProps> = ({ account }) => {
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
                'flex items-center justify-between p-6 rounded-lg shadow-md',
                boxStyle
            )}
        >
            <div>
                <h2 className='text-xl font-inter font-semibold'>
                    {(variant ? variant.charAt(0).toUpperCase() + variant.slice(1) : "Unknown")}
                </h2>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-lg font-bold">
                    ${account.balance?.toFixed(2)}
                </span>
                <Button className="bg-gray-100 p-3 rounded-md shadow-sm">
                    <span className="text-black font-bold">+</span>
                </Button>
            </div>
        </div>
    );
};

export default AdminAccountBox;