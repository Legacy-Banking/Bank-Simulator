"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import * as z from "zod";
import { BankDropdown } from "./BankDropDown";
import { Button } from "./ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Checkbox } from "@/components/ui/checkbox"; // Import Checkbox from shadcn
import { PaymentWhenOptions } from "./PaymentWhenOptions";
import { BillerDropdown } from './BillerDropDown';
import { transactionAction } from '@/utils/transactionAction'; // Import the transaction action

const formSchema = z.object({
  toBiller: z.number().nullable().optional(),
  fromBank: z.number().min(1, "Please select a valid bank account"),
  billerCode: z.string().optional(),
  billerName: z.string().optional(),
  referenceNum: z.string().optional(),
  amount: z.string().min(1, "Amount is required").regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid amount"),
  description: z.string().optional(),
  saveBiller: z.boolean().optional(),
  paymentOption: z.enum(["payNow", "schedule", "recurring"]).default("payNow"), // Payment options
  fromBankType: z.enum(["debit", "credit", "personal", "savings"]), // Payment options
  scheduleDate: z.date().optional(),
  frequency: z.string().optional(),
  recurringStartDate: z.date().optional(),
  endCondition: z.string().optional(),
  endDate: z.date().optional(),
  numberOfPayments: z.string().optional(),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
})
  .superRefine((data, ctx) => {

    // If `billerCode`, `billerName`, and `referenceNum` are all filled, skip `toBiller` validation
    const hasManualBillerInfo =
      data.billerCode && data.billerName && data.referenceNum;

    // Only validate `toBiller` if manual biller fields are not filled
    if (!hasManualBillerInfo && data.toBiller === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["toBiller"],
        message: "Please select a valid biller or fill in manual biller information",
      });
    }

    // Only require billerCode, billerName, and referenceNum when `toBiller` is null
    if (data.toBiller === 0) {
      if (!data.billerCode || !/^\d{4}$/.test(data.billerCode)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["billerCode"],
          message: "Biller Code must be a 4-digit number",
        });
      }
      if (!data.billerName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["billerName"],
          message: "Biller Name is required if no biller is selected",
        });
      }
      if (!data.referenceNum || !/^\d{12}$/.test(data.referenceNum)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["referenceNum"],
          message: "Reference Number must be a 12-digit number",
        });
      }
    }


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
      if (data.endCondition === "numberOfPayments") {
        if (isNaN(Number(data.numberOfPayments)) || Number(data.numberOfPayments) <= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["numberOfPayments"],
            message: "Please enter the number of payments",
          });
        }

        // Validation for debit card details
        if (data.fromBankType === "debit") {  // Check if the selected account type is 'debit'
          if (!data.cardNumber || !/^\d{16}$/.test(data.cardNumber)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["cardNumber"],
              message: "Card Number must be 16 digits",
            });
          }
          if (!data.expiryDate || !/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(data.expiryDate)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["expiryDate"],
              message: "Expiry Date must be in MM/YY format",
            });
          }
          if (!data.cvv || !/^\d{3}$/.test(data.cvv)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["cvv"],
              message: "CVV must be 3 digits",
            });
          }
        }
      }
    }
  });


const BPAYForm = ({ accounts, billers }: { accounts: Account[], billers: BillerAccount[] }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // State to manage error messages
  const [showCardDetails, setShowCardDetails] = useState(false); // State to control visibility of card details section

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
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
  });

  // Watch for changes in fields
  const toBiller = useWatch({ control: form.control, name: "toBiller" });
  const billerCode = useWatch({ control: form.control, name: "billerCode" });
  const billerName = useWatch({ control: form.control, name: "billerName" });
  const referenceNum = useWatch({ control: form.control, name: "referenceNum" });

  const fromBank = useWatch({ control: form.control, name: "fromBank" });
  useEffect(() => {
    // Find the selected account type and show card details if it's a personal account
    const selectedAccount = accounts.find(account => Number(account.id) === fromBank);
    form.setValue("fromBankType", selectedAccount?.type);
    setShowCardDetails(selectedAccount?.type === 'debit');
  }, [fromBank, accounts]);

  // Clear manual biller fields if a toBiller is selected
  useEffect(() => {
    if (toBiller && toBiller !== 0) {
      form.setValue("billerCode", "");
      form.setValue("billerName", "");
      form.setValue("referenceNum", "");
    }
  }, [toBiller, form]);

  useEffect(() => {
    if (billerCode || billerName || referenceNum) {
      // Reset selected biller if any manual field is filled
      form.setValue("toBiller", 0);
    }
  }, [billerCode, billerName, referenceNum]);

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

      // Prepare card details if required
      const cardDetails = showCardDetails
        ? {
          cardNumber: data.cardNumber,
          expiryDate: data.expiryDate,
          cvv: data.cvv,
        }
        : null;

      //const billerDetail = `Biller ${data.toBiller}`;

      const billerDetail = String(data.toBiller);


      console.log("Creating transaction with the following details:")
      // Call the createBPAYTransaction action
      await transactionAction.createBPAYTransaction(
        fromAccount,
        billerDetail,
        data.referenceNum,
        amountF,
        data.description || '',
        cardDetails
      );

      if (data.saveBiller) {
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

  //const selectedPaymentOption = form.watch("paymentOption");

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
                    <BillerDropdown
                      billerAccounts={billers} // Pass billers array here
                      onChange={(id) => {
                        if (id) {
                          form.setValue("toBiller", Number(id));  // Ensure the ID is treated as a number
                          console.log("Biller Selected: ", id);
                        }
                      }}
                      initialSelected={(form.getValues("toBiller")) || undefined}
                      label="Select Biller"
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
              <div className="payment-transfer_form-item pb-5 pt-6 ">
                <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">Biller Code</FormLabel>
                <div className="flex w-full flex-col ">
                  <FormControl>
                    <Input placeholder="Enter 4-digit Biller Code" className="input-class bg-white-100" {...field} />
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
                    <Input placeholder="Enter Biller Name" className="input-class bg-white-100" {...field} />
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
                    <Input placeholder="Enter 12-digit Reference Number" className="input-class bg-white-100" {...field} />
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
              className="custom-checkbox" />
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

        {/* Card Details Section - Render only if the selected account is personal */}
        {showCardDetails && (
          <div>
            {/* Card Number */}
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem className="border-t border-gray-200">
                  <div className="payment-transfer_form-item py-5">
                    <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">Card Number</FormLabel>
                    <div className="flex w-full flex-col">
                      <FormControl>
                        <Input placeholder="ex: 1234 1234 1234 1234" className="input-class bg-white-100" {...field} />
                      </FormControl>
                      <FormMessage className="text-12 text-red-500" />
                    </div>
                  </div>
                </FormItem>
              )}
            />

            {/* Expiry Date */}
            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <div className="payment-transfer_form-item py-5">
                    <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">Expiry Date</FormLabel>
                    <div className="flex w-full flex-col">
                      <FormControl>
                        <Input placeholder="MM/YY" className="input-class bg-white-100" {...field} />
                      </FormControl>
                      <FormMessage className="text-12 text-red-500" />
                    </div>
                  </div>
                </FormItem>
              )}
            />

            {/* CVV */}
            <FormField
              control={form.control}
              name="cvv"
              render={({ field }) => (
                <FormItem>
                  <div className="payment-transfer_form-item py-5">
                    <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">CVV</FormLabel>
                    <div className="flex w-full flex-col">
                      <FormControl>
                        <Input placeholder="ex: 987" className="input-class bg-white-100" {...field} />
                      </FormControl>
                      <FormMessage className="text-12 text-red-500" />
                    </div>
                  </div>
                </FormItem>
              )}
            />
          </div>
        )}

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
        <PaymentWhenOptions />

        {error && <p className="text-red-500 mt-4">{error}</p>} {/* Display error message if any */}

        <div className="payment-transfer_btn-box mt-6">
          <Button type="submit" className="text-14 w-full bg-blue-gradient font-semibold text-white-100 shadow-form">
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" /> &nbsp; Sending...
              </>
            ) : (
              "Pay Bill"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BPAYForm;
