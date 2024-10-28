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
} from "@/components/shadcn_ui/select";


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
  const [selected, setSelected] = useState<string | null>(initialSelected || "");

  useEffect(() => {
    // Reset selected value when initialSelected changes
    setSelected(initialSelected || "");
  }, [initialSelected]);

  const handleBillerChange = (id: string) => {
    if (id === "reset") {
      // Reset the dropdown selection
      setSelected(null);
      onChange(""); // Pass null to onChange to signal no selection
    } else {
      const account = billerAccounts.find((account) => String(account.id) === String(id));
      setSelected(String(account?.id) || "");
      onChange(String(account?.id) || "");
    }
  };

  return (
    <>
      <Select
        value={String(selected) || ""}
        onValueChange={(value) => {
          console.log("onValueChange triggered with:", value);
          handleBillerChange(value)}}
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
          {selected
            ? billerAccounts.find((account) => String(account.id) === selected)?.name ||
              "Select Biller"
            : "Choose Biller"}
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
            {billerAccounts.map((account: BillerAccount) => (
              <SelectItem
                key={account.id}
                value={account.id}
                className="cursor-pointer border-t hover:bg-gray-100"
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
