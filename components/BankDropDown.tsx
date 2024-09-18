"use client";

import React, { useState, useEffect } from 'react';
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
  additionalOption,
}: {
  accounts: Account[],
  onChange: (id: string | null) => void,
  initialSelected?: string,
  label: string,
  otherStyles?: string,
  additionalOption?: { id: string , label: string },
}) => {
  const [selected, setSelected] = useState<Account | null>(
    initialSelected ? accounts.find(acc => acc.id === initialSelected) || null : null
  );

  useEffect(() => {
    if (initialSelected) {
      const account = accounts.find(acc => acc.id === initialSelected) || null;
      setSelected(account);
    }
  }, [initialSelected, accounts]);

  const handleBankChange = (id: string) => {
    console.log("ID received:", id);  // Add a console log here for debugging
    if (id === "reset") {
      console.log("here1");
      setSelected(null);
      onChange("");
    } else if (id === additionalOption?.id) {
      console.log("here2");
      setSelected(null);
      onChange(id);
    } else {
    const account = accounts.find((account) => String(account.id) === String(id)) || null;
    console.log("Account found:", account); // Log the found account
    setSelected(account);
    onChange(String(account?.id ?? ""));
    }
  };
  
  return (
    <>
      <Select
        value={String(selected?.id)} 
        onValueChange={(value) => {
          console.log("onValueChange triggered with:", value);  // Log to track
          handleBankChange(value);
        }}
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
            {selected ? `${selected.type} - ${formatCurrency(selected.balance)}` : "Choose Account"}
          </p>
        </SelectTrigger>
        <SelectContent
          className={`w-full bg-white-100 md:w-[300px] ${otherStyles}`}
          align="end"
        >
          <SelectGroup>
          <SelectItem value="reset" className="py-2 font-normal text-gray-500">
            {label}
          </SelectItem>
            {accounts.map((account: Account) => (
              <SelectItem
                key={account.id}
                value={account.id}
                className="cursor-pointer border-t hover:bg-gray-100"
              >
                <div className="flex flex-col ">
                  <p className="text-16 font-medium ">{`${account.type}`}</p>
                  <p className="text-14 font-medium text-blue-600 ">
                    {formatCurrency(account.balance)}
                  </p>
                </div>
              </SelectItem>
            ))}
            {additionalOption && ( // Display "Use Card" option
              <SelectItem
                key={additionalOption.id}
                value={additionalOption.id}
                className="cursor-pointer border-t hover:bg-gray-100"
              >
                <p className="text-16 font-medium">{additionalOption.label}</p>
              </SelectItem>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Display the balance below the dropdown */}
      {selected && (
        <p className="mt-4 text-14 font-medium text-blue-25">
          Balance: {formatCurrency(selected.balance)}
        </p>
      )}
    </>
  );
};