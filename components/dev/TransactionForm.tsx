import React from 'react'
import { transactionAction } from '@/lib/actions/transactionAction'

type TransactionFormProps = {
    fromAccount: Account;
    toAccount: Account;
    amount: number;
    description: string;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ fromAccount, toAccount, amount, description }) => {
    const onclick = () => {
        transactionAction.createTransaction(fromAccount, toAccount, amount, description, "transfer funds");
    }


    return (
        <div className="flex flex-col gap-4">
            <button onClick={onclick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Transfer</button>
        </div>
    )
}
export default TransactionForm