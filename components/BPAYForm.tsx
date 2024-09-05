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
import { Checkbox } from "@/components/ui/checkbox"; // Import Checkbox from shadcn

// Zod schema for form validation with biller details and checkboxes
const formSchema = z.object({
  toBiller: z.number().min(1, "Please select a valid biller"), // Validates the 'fromBank' selection
  fromBank: z.number().min(1, "Please select a valid bank account"), // Validates the 'fromBank' selection
  billerCode: z.string().regex(/^\d{4}$/, "Biller Code must be a 4-digit number"), // 4-digit Biller Code
  billerName: z.string().min(1, "Biller Name is required"), // Biller name
  referenceNum: z.string().regex(/^\d{12}$/, "Reference Number must be a 12-digit number"), // 12-digit Reference Number
  amount: z.string().min(1, "Amount is required").regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid amount"), // Amount validation
  description: z.string().optional(), // Optional description
  saveBiller: z.boolean().optional(), // Checkbox for saving biller
  paymentOption: z.enum(["payNow", "schedule", "recurring"]).default("payNow"), // Payment options (Pay Now, Schedule, Recurring)
});

const BPAYForm = ({ accounts }: { accounts: Account[] }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // State to manage error messages

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      toBiller: 0, // Set default value as 0 for numeric IDs
      fromBank: 0, // Set default value as 0 for numeric IDs
      billerCode: "",
      billerName: "",
      referenceNum: "",
      amount: "",
      description: "",
      saveBiller: false,
      paymentOption: "payNow", // Default to "Pay Now"
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

      const { billerCode, billerName, referenceNum, amount, description, saveBiller, paymentOption } = data;

      // Simulate transaction logic
      console.log(`Paying ${amount} to ${billerName} (BSB: ${billerCode}, Ref: ${referenceNum}) with option: ${paymentOption}`);

      if (saveBiller) {
        console.log("Biller will be saved for future transactions.");
      }

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
          <h2 className="text-18 font-semibold text-gray-900">Biller Details</h2>
          <p className="text-14 font-normal text-gray-600">Enter the details of the biller</p>
        </div>

        <FormField
          control={form.control}
          name="toBiller"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content">
                  <FormLabel className="text-14 font-medium text-gray-700">Select Biller</FormLabel>
                  <FormDescription className="text-12 font-normal text-gray-600">
                    Select the biller you want to pay to
                  </FormDescription>
                </div>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <BankDropdown
                      accounts={accounts}
                      onChange={(id) => {
                        if (id) {
                          form.setValue("toBiller", Number(id));  // Ensure the ID is treated as a number
                          console.log("From Bank Changed: ", id);
                        }
                      }}
                      initialSelected={(form.getValues("toBiller")) || undefined}
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
          <h2 className="text-18 font-semibold text-gray-900">OR</h2>
        </div>

        <FormField
          control={form.control}
          name="billerCode"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-5 pt-6">
                <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">Biller Code</FormLabel>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input placeholder="Enter 4-digit Biller Code" className="input-class" {...field} />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="billerName"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-5 pt-6">
                <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">Biller Name</FormLabel>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input placeholder="Enter Biller Name" className="input-class" {...field} />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="referenceNum"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-5 pt-6">
                <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">Reference Number</FormLabel>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input placeholder="Enter 12-digit Reference Number" className="input-class" {...field} />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

      <div className="border-t border-gray-200 ">
        <label className="payment-transfer_form-item pb-5 pt-6">
          <span className="text-14 w-full max-w-[280px] font-medium text-gray-700">Save to my Billers
          <p className="text-14 font-normal text-gray-600">Save this Billers details</p>
          </span>
          <Checkbox {...form.register("saveBiller")} 
          className="custom-checkbox"/>
        </label>
      </div>


        <div className="payment-transfer_form-details">
          <h2 className="text-18 font-semibold text-gray-900">Step 2 - Payment Details</h2>
          <p className="text-14 font-normal text-gray-600">Select the bank account you want to pay then enter the amount and date of payment</p>
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


        {/* Payment Options (Pay Now, Schedule Payment, Recurring Payment) */}
        <div className="border-t border-gray-200 flex w-full max-w-[850px] flex-col gap-12 md:flex-row lg:gap-20 pb-5 pt-6">
          <label className="flex justify-between items-center space-x-6">
            <span className="text-14 w-full max-w-[280px] font-medium text-gray-700">Pay Now</span>
            <Checkbox
              {...form.register("paymentOption", { value: "payNow" })}
              className="custom-checkbox" // Make checkbox bigger
            />
          </label>
          <label className="flex justify-between items-center space-x-6">
            <span className="text-14 w-full max-w-[280px] font-medium text-gray-700">Schedule Payment</span>
            <Checkbox
              {...form.register("paymentOption", { value: "schedule" })}
              className="custom-checkbox" // Make checkbox bigger
            />
          </label>
          <label className="flex justify-between items-center space-x-6">
            <span className="text-14 w-full max-w-[280px] font-medium text-gray-700">Recurring Payment</span>
            <Checkbox
              {...form.register("paymentOption", { value: "recurring" })}
              className="custom-checkbox" // Make checkbox bigger
            />
          </label>
        </div>


        {error && <p className="text-red-500 mt-4">{error}</p>} {/* Display error message if any */}

        <div className="payment-transfer_btn-box mt-6">
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

export default BPAYForm;
