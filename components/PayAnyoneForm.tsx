"use client";

import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import * as z from "zod";
import { BankDropdown } from "./BankDropDown";
import { Button } from "./ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

// Zod schema for form validation with BSB and account number
const formSchema = z.object({
  fromBank: z.number().min(1, "Please select a valid bank account"), // Validates the 'fromBank' selection
  bsb: z
    .string()
    .regex(/^\d{6}$/, "BSB must be a 6-digit number"), // Validates BSB
  accountNum: z
    .string()
    .regex(/^\d{9}$/, "Account number must be a 9-digit number"), // Validates account number
  amount: z.string().min(1, "Amount is required").regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid amount"), // Validates amount
  description: z.string().optional(), // Optional description
});

const PayAnyoneForm = ({ accounts }: { accounts: Account[] }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // State to manage error messages

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromBank: 0, // Set default value as 0 for numeric IDs
      bsb: "",
      accountNum: "",
      amount: "",
      description: "",
    },
  });

  const submit = async (data: z.infer<typeof formSchema>) => {
    setError(null); // Clear previous error
    setIsLoading(true);

    try {
      const fromAccount = accounts.find(account => Number(account.id) === data.fromBank);

      if (!fromAccount) {
        throw new Error("Invalid bank account selected.");
      }

      const amountF = parseFloat(data.amount);

      // Check for insufficient funds
      if (fromAccount.balance < amountF) {
        setError("Insufficient funds in selected account.");
        setIsLoading(false);
        return;
      }
  

      const { bsb, accountNum, amount, description } = data;

      // Simulate transaction logic
      console.log(`Paying ${amount} to BSB ${bsb}, Account ${accountNum}`);

      form.reset();
      router.push("/dashboard");
    } catch (error) {
      console.error("Submitting create transfer request failed: ", error);

      // Handle error properly
      if (error instanceof Error) {
        setError(error.message || "An error occurred during the transfer.");
      } else {
        setError("An unexpected error occurred during the transfer.");
      }
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="flex flex-col">
        <div className="payment-transfer_form-details">
          <h2 className="text-18 font-semibold text-gray-900">Step 1 - Select Your Account</h2>
          <p className="text-16 font-normal text-gray-600">Select the bank account you want to pay from</p>
        </div>

        <FormField
          control={form.control}
          name="fromBank"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content">
                  <FormLabel className="text-14 font-medium text-gray-700">From Bank Account</FormLabel>
                  <FormDescription className="text-12 font-normal text-gray-600">
                    Select the bank account you want to transfer funds from
                  </FormDescription>
                </div>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <BankDropdown
                      accounts={accounts}
                      onChange={(id) => {
                        if (id) {
                          form.setValue("fromBank", Number(id));  // Ensure the ID is treated as a number
                          console.log("From Bank Changed: ", id);
                        }
                      }}
                      initialSelected={(form.getValues("fromBank")) || undefined}
                      label="From Bank Account"
                      otherStyles="!w-full"
                    />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <div className="payment-transfer_form-details">
          <h2 className="text-18 font-semibold text-gray-900">Step 2 - Bank account details</h2>
          <p className="text-16 font-normal text-gray-600">Enter the bank account details of the recipient</p>
        </div>

        <FormField
          control={form.control}
          name="bsb"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-5 pt-6">
                <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">Receiver's BSB</FormLabel>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input placeholder="Enter BSB" className="input-class" {...field} />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="accountNum"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-5 pt-6">
                <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">Receiver's Account Number</FormLabel>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input placeholder="Enter account number" className="input-class" {...field} />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="border-y border-gray-200">
              <div className="payment-transfer_form-item py-5">
                <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">Amount</FormLabel>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input placeholder="ex: 100.00" className="input-class bg-white-100" {...field} />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content">
                  <FormLabel className="text-14 font-medium text-gray-700">Description (Optional)</FormLabel>
                  <FormDescription className="text-12 font-normal text-gray-600">
                    Provide additional information or instructions (optional)
                  </FormDescription>
                </div>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Textarea placeholder="Write a short description here" className="input-class bg-white-100" {...field} />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        {error && <p className="text-red-500 mt-4">{error}</p>} {/* Display error message if any */}

        <div className="payment-transfer_btn-box">
          <Button type="submit" className="text-14 w-full bg-blue-gradient font-semibold text-white-100 shadow-form">
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" /> &nbsp; Sending...
              </>
            ) : (
              "Pay"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PayAnyoneForm;
