'use client';
import React, { useState } from 'react';
import { Account, AccountType } from '@/types/Account';
import { createClient } from '@/utils/supabase/client';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { updateUserId } from '@/app/store/userSlice';

// Utility function to get user ID
const fetchUserId = async (dispatch: Function) => {
    const supabase = createClient();
    try {
        const { data, error } = await supabase.auth.getUser();
        if (error || !data.user) {
            throw new Error('Failed to fetch user');
        }
        dispatch(updateUserId(data.user.id || ""));
        return data.user.id || "";
    } catch (error) {
        console.error('Error fetching user ID:', error);
        return "";
    }
};

// Utility function to handle form submission
const handleFormSubmit = async (account: Partial<Account>, user_id: string) => {
    const supabase = createClient();
    try {
        const { data, error } = await supabase
            .from('account')
            .insert([
                {
                    owner: user_id,
                    accountType: account.type,
                    balance: account.balance,
                },
            ])
            .select();

        if (error) {
            throw new Error(error.message);
        }
        return data;
    } catch (error) {
        console.error('Error submitting form:', error);
    }
};

const AccountForm: React.FC = () => {
    const user = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();

    const [account, setAccount] = useState<Partial<Account>>({
        type: AccountType.SAVINGS,
        balance: 0,
        user_id: 'hello',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setAccount((prevAccount) => ({
            ...prevAccount,
            [name]: name === 'balance' ? parseFloat(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!account.user_id) {
            account.user_id = await fetchUserId(dispatch);
        }
        const result = await handleFormSubmit(account, account.user_id);
        if (result) {
            console.log('Form submitted successfully:', result);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 rounded shadow-lg max-w-md mx-auto">
            <FormField
                id="type"
                label="Account Type"
                value={account.type}
                onChange={handleChange}
                options={Object.values(AccountType)}
                type="select"
            />
            <FormField
                id="balance"
                label="Balance"
                value={account.balance}
                onChange={handleChange}
                type="number"
            />
            <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Submit
            </button>
        </form>
    );
};

// Component for rendering form fields
interface FormFieldProps {
    id: string;
    label: string;
    value: any;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    options?: string[];
    type: 'text' | 'number' | 'select';
}

const FormField: React.FC<FormFieldProps> = ({ id, label, value, onChange, options, type }) => (
    <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor={id}>
            {label}
        </label>
        {type === 'select' ? (
            <select
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                className="w-full px-3 py-2 border rounded"
                required
            >
                {options?.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        ) : (
            <input
                type={type}
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                className="w-full px-3 py-2 border rounded"
                required
            />
        )}
    </div>
);

export default AccountForm;
