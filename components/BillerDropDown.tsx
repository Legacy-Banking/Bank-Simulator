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
  accounts = [],
  onChange,
  initialSelected,
  label,
  otherStyles,
}: {
  accounts: BillerAccount[],
  onChange: (id: string | null) => void,
  initialSelected?: string,
  label: string,
  otherStyles?: string,
}) => {
  const [selected, setSelected] = useState<BillerAccount | null>(
    initialSelected ? accounts.find(acc => acc.id === initialSelected) || null : null
  );

  useEffect(() => {
    if (initialSelected) {
      const account = accounts.find(acc => acc.id === initialSelected) || null;
      setSelected(account);
    }
  }, [initialSelected, accounts]);

  const handleBillerChange = (id: string) => {
    const account = accounts.find((account) => account.id === id) || null;
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
          <Image
            src="/biller-icon.svg" // Replace this with an appropriate icon for billers
            width={20}
            height={20}
            alt="biller"
          />
          <p className="line-clamp-1 w-full text-left">
            {selected ? `${selected.billerName} - ${selected.billerCode}` : "Choose Biller"}
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
            {accounts.map((account: BillerAccount) => (
              <SelectItem
                key={account.id}
                value={account.id}
                className="cursor-pointer border-t"
              >
                <div className="flex flex-col">
                  <p className="text-16 font-medium">{`${account.billerName}`}</p>
                  <p className="text-14 font-medium text-gray-600">
                    Biller Code: {account.billerCode}
                  </p>
                  <p className="text-14 text-blue-600">Reference: {account.refNum}</p>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
};
