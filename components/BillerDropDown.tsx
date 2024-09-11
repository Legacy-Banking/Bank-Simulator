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


export const BillerDropdown = ({
  billerAccounts = [],
  onChange,
  initialSelected,
  label,
  otherStyles,
}: {
  billerAccounts: BillerAccount[],
  onChange: (id: string | null) => void,
  initialSelected?: string,
  label: string,
  otherStyles?: string,
}) => {
  const [selected, setSelected] = useState<BillerAccount | null>(
    initialSelected ? billerAccounts.find(acc => acc.id === initialSelected) || null : null
  );

  useEffect(() => {
    if (initialSelected) {
      const account = billerAccounts.find(acc => acc.id === initialSelected) || null;
      setSelected(account);
    }
  }, [initialSelected, billerAccounts]);

  const handleBillerChange = (id: string) => {
    const account = billerAccounts.find((account) => account.id === id) || null;
    setSelected(account);
    onChange(account ? account.id : null);
  };

  return (
    <>
      <Select
        value={selected?.id || ""}
        onValueChange={(value) => handleBillerChange(value)}
      >
        <SelectTrigger
          className={`flex w-full bg-white-100 gap-3 md:w-[300px] ${otherStyles}`}
        >
          <Image className='filter-blue-500'
            src="/biller-icon.svg"
            width={24}
            height={24}
            alt="biller"
          />
          <p className="line-clamp-1 w-full text-left">
            {selected ? `${selected.name}` : "Choose Biller"}
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
            {billerAccounts.map((account: BillerAccount) => (
              <SelectItem
                key={account.id}
                value={account.id}
                className="cursor-pointer border-t"
              >
                <div className="flex flex-col">
                  <p className="text-16 font-medium">{`${account.name}`}</p>
                  <p className="text-12 font-medium text-blue-500">
                    Biller Code: {account.biller_code}
                  </p>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
};
