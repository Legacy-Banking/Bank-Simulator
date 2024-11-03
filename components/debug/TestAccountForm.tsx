'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAppSelector } from '@/store/hooks';
import { accbsbGenerator } from '@/lib/utils/accbsbGenerator';

const handleFormSubmit = async (account: Partial<Account>, user_id: string) => {
    const supabase = createClient();
    const { bsb, acc } = accbsbGenerator();
    try {
        const { data, error } = await supabase
            .from('account')
            .insert([
                {
                    owner: user_id,
                    type: account.type,
                    balance: account.balance,
                    bsb: bsb,
                    acc: acc,
                    opening_balance: account.balance,
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

const TestAccountForm: React.FC = () => {
    const user_id = useAppSelector((state) => state.user.user_id);
    const [account, setAccount] = useState<Partial<Account>>({
        type: AccountType.SAVINGS,
        balance: 0,
        owner: user_id,
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
        const result = await handleFormSubmit(account, user_id);
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

export default TestAccountForm;
