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
import { Checkbox } from "@/components/ui/checkbox"; // Import Checkbox from shadcn
import { PaymentWhenOptions } from "./PaymentWhenOptions";

const formSchema = z.object({
  toBiller: z.number().min(1, "Please select a valid biller"),
  fromBank: z.number().min(1, "Please select a valid bank account"),
  billerCode: z.string().regex(/^\d{4}$/, "Biller Code must be a 4-digit number"),
  billerName: z.string().min(1, "Biller Name is required"),
  referenceNum: z.string().regex(/^\d{12}$/, "Reference Number must be a 12-digit number"),
  amount: z.string().min(1, "Amount is required").regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid amount"),
  description: z.string().optional(),
  saveBiller: z.boolean().optional(),
  paymentOption: z.enum(["payNow", "schedule", "recurring"]).default("payNow"), // Payment options
  scheduleDate: z.date().optional(),
  frequency: z.string().optional(),
  recurringStartDate: z.date().optional(),
  endCondition: z.string().optional(),
  endDate: z.date().optional(),
  numberOfPayments: z.string().regex(/^\d+$/, "Please enter a valid number of payments").optional(),
})
.superRefine((data, ctx) => {
  // Schedule Payment validation
  if (data.paymentOption === "schedule" && !data.scheduleDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["scheduleDate"],
      message: "Please select a date for scheduled payment",
    });
  }

  // Recurring Payment validation
  if (data.paymentOption === "recurring") {
    // Frequency is required
    if (!data.frequency) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["frequency"],
        message: "Please select a frequency for recurring payment",
      });
    }

    // Start Date is required
    if (!data.recurringStartDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["recurringStartDate"],
        message: "Please select a start date for recurring payment",
      });
    }

    // End condition is required
    if (!data.endCondition) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endCondition"],
        message: "Please select an end condition for recurring payment",
      });
    }

    // End Date is required if "setEndDate" is selected
    if (data.endCondition === "setEndDate" && !data.endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "Please select an end date",
      });
    }

    // Number of Payments is required if "numberOfPayments" is selected
    if (data.endCondition === "numberOfPayments" && !data.numberOfPayments) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["numberOfPayments"],
        message: "Please enter the number of payments",
      });
    }
  }
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
      scheduleDate: undefined,
      frequency: "",
      recurringStartDate: undefined,
      endCondition: "",
      endDate: undefined,
      numberOfPayments: "",
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

  const selectedPaymentOption = form.watch("paymentOption");

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
        <PaymentWhenOptions/>



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
