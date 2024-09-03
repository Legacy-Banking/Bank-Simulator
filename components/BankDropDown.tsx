"use client";

import React, { useState } from 'react';
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";

// Utility to format currency amounts
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const BankDropdown = ({
  accounts = [],
  onChange,
  initialSelected,
  label,
  otherStyles,
}: {
  accounts: Account[],
  onChange: (id: string | null) => void,  // id can now be null
  initialSelected?: string,
  label: string,
  otherStyles?: string,
}) => {
  const [selected, setSelected] = useState<Account | null>(
    initialSelected ? accounts.find(acc => acc.id === initialSelected) || null : null
  );

  const handleBankChange = (id: string) => {
    const account = accounts.find((account) => account.id === id) || null;
    setSelected(account);
    onChange(account ? account.id : null);  // Pass null if no account is selected
  };

  return (
    <Select
      defaultValue={selected?.id || ""}
      onValueChange={(value) => handleBankChange(value)}
    >
      <SelectTrigger
        className={`flex w-full bg-white-100 gap-3 md:w-[300px] ${otherStyles}`}
      >
        <Image
          src="/credit-card.svg"
          width={20}
          height={20}
          alt="account"
        />
        <p className="line-clamp-1 w-full text-left">
          {selected ? selected.name : ""}
        </p>
      </SelectTrigger>
      <SelectContent
        className={`w-full bg-white-100 md:w-[300px] ${otherStyles}`}
        align="end"
      >
        <SelectGroup>
          <SelectLabel className="py-2 font-normal text-gray-500">
            {label}
          </SelectLabel>
          {accounts.map((account: Account) => (
            <SelectItem
              key={account.id}
              value={account.id}
              className="cursor-pointer border-t"
            >
              <div className="flex flex-col">
                <p className="text-16 font-medium">{account.name}</p>
                <p className="text-14 font-medium text-blue-600">
                  {formatCurrency(account.currentBalance)}
                </p>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
