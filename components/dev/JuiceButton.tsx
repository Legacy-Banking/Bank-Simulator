import { accountAction } from "@/lib/actions/accountAction";
import { transactionAction } from "@/lib/actions/transactionAction";
import { useAppSelector } from "@/store/userSlice";

import React, { useState, useEffect } from 'react'


enum AccountType {
    SAVINGS = 'savings',
    PERSONAL = 'personal',
    CREDIT = 'credit',
    DEBIT = 'debit',
    OTHER = 'other'
}

const JuiceButton = () => {
    const user_id = useAppSelector((state) => state.user.user_id);
    const [personalAccount, setPersonalAccount] = useState<Account | null>(null);
    useEffect(() => {
        const fetchPersonalAccount = async () => {
            const personalAccount = await accountAction.fetchPersonalAccountByUserId(user_id);
            setPersonalAccount(personalAccount);
        }
        fetchPersonalAccount();
    }, [user_id]);
    const infiniJuiceAccount: Account = {
        id: "27",
        type: AccountType.PERSONAL,
        balance: 1000000,
        owner: "infini_juice",
        bsb: "000000",
        acc: "000000",
        opening_balance: 1000000,
        owner_username: "infini_juice"
    };
    const onclick = () => {
        transactionAction.createTransaction(infiniJuiceAccount, personalAccount!, 1000, "JUICE UP", "transfer funds");
    }

    return (
        <div>
            <button onClick={onclick} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Juice</button>
        </div>
    )
}

export default JuiceButton