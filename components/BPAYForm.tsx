"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import * as z from "zod";
import { BankDropdown } from "./BankDropDown";
import CardSidebar from './CardSidebar';
import { Button } from "./shadcn_ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./shadcn_ui/form";
import { Input } from "./shadcn_ui/input";
import { Checkbox } from "@/components/shadcn_ui/checkbox"; // Import Checkbox from shadcn
import { PaymentWhenOptions } from "./PaymentWhenOptions";
import { BillerDropdown } from './BillerDropDown';
import { useAppSelector } from '@/store/hooks';
import { bpayAction } from '@/lib/actions/bpayAction';
import { billerAction } from '@/lib/actions/billerAction';
import { scheduleAction } from '@/lib/actions/scheduleAction';
import { cardAction } from '@/lib/actions/cardAction';
import { billAction } from '@/lib/actions/billAction';


const formSchema = z.object({
  toBiller: z.string().optional(),
  fromBank: z.string().min(1, "Please select a valid bank account"),
  billerCode: z.string().optional(),
  billerName: z.string().optional(),
  referenceNum: z.string().optional(),
  amount: z.string().min(1, "Amount is required").regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid amount"),
  description: z.string().max(300, "Description must be 300 characters or less").optional(),
  saveBiller: z.number().optional(),
  paymentOption: z.enum(["payNow", "schedule", "recurring"]).default("payNow"),
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
    const hasManualBillerInfo = data.billerCode && data.billerName && data.referenceNum;

    // Only validate `toBiller` if manual biller fields are not filled
    if (!hasManualBillerInfo && !data.toBiller) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["toBiller"],
        message: "Please select a valid biller or fill in manual biller information",
      });
    }

    // Only require billerCode, billerName, and referenceNum when `toBiller` is null
    if (!data.toBiller) {
      if (!data.billerCode || !/^\d{4,6}$/.test(data.billerCode)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["billerCode"],
          message: "Biller Code must be a 4 to 6-digit number",
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
        const numPayments = Number(data.numberOfPayments);
        // Check if the value is a number, positive, and an integer
        if (isNaN(numPayments) || numPayments <= 0 || !Number.isInteger(numPayments)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["numberOfPayments"],
            message: "Please enter the number of payments",
          });
        }

        // Validation for debit card details
        if (data.fromBank === "-1") {  // Check if the selected account type is "Use Card"
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
  const user_id = useAppSelector(state => state.user.user_id);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      toBiller: "",
      fromBank: "",
      billerCode: "",
      billerName: "",
      referenceNum: "",
      amount: "",
      description: "",
      saveBiller: 0,
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
  // Show card details if "Use Card" is selected

  useEffect(() => {
    // If "Use Card" is selected, show the card details
    if (fromBank === "-1") {
      setShowCardDetails(true);
    } else {
      setShowCardDetails(false);
    }
  }, [fromBank, accounts, form]);

  // Clear manual biller fields if a toBiller is selected
  useEffect(() => {
    if (toBiller && toBiller !== "") {
      form.setValue("billerCode", "");
      form.setValue("billerName", "");
      form.setValue("referenceNum", "");
    }
  }, [toBiller, form])

  useEffect(() => {
    if (billerCode || billerName || referenceNum) {
      // Reset selected biller if any manual field is filled
      form.setValue("toBiller", "");
    }
  }, [billerCode, billerName, referenceNum, form]);

  const submit = async (data: z.infer<typeof formSchema>) => {

    setError(null); // Clear previous error
    setIsLoading(true);

    try {
      let fromAccount = accounts.find(account => String(account.id) === data.fromBank);

      // If no bank account is selected, check for card details and fetch the corresponding account
      if (!fromAccount && showCardDetails) {
        const { cardNumber, expiryDate, cvv } = data;

        // Ensure that card details are not undefined
        if (!cardNumber || !expiryDate || !cvv) {
          throw new Error("Please provide valid card details.");
        }

        // Create a sanitized card number by removing all spaces
        const sanitizedCardNumber = cardNumber.replace(/\s+/g, "");

        // Fetch the account linked to the card
        fromAccount = await cardAction.fetchCardAccountId({
          cardNumber: sanitizedCardNumber,
          expiryDate,
          cvv,
        });

        if (!fromAccount) {
          throw new Error("Invalid card details or card not linked to an account.");
        }
      }

      if (!fromAccount) {
        throw new Error("Please select a bank account or provide valid card details.");
      }


      const amountF = parseFloat(data.amount);
      let totalAmount = amountF;

      // If "numberOfPayments" is selected, calculate total amount
      if (data.endCondition === "numberOfPayments") {
        const numPayments = parseInt(data.numberOfPayments!, 10);

        if (!isNaN(numPayments) && numPayments > 0) {
          totalAmount = amountF * numPayments;
        } else {
          setError("Invalid number of payments entered.");
          setIsLoading(false);
          return;
        }
      }

      // Check for insufficient funds
      if (fromAccount.balance < totalAmount) {
        setError("Insufficient funds in selected account.");
        setIsLoading(false);
        return;
      }

      // Variables to hold final biller details
      let finalBillerName: string = '';
      let finalBillerCode: string = '';
      let finalReferenceNum: string = '';


      // Check if toBiller is selected
      if (data.toBiller != "") {
        // Fetch the biller details from the billers table using the toBiller ID
        const biller = await billerAction.fetchBillerById(String(data.toBiller));
        finalBillerName = biller.name;
        finalBillerCode = biller.biller_code;
        // Fetch the reference number from the user_billers table
        const referenceNum = await billerAction.fetchReferenceNumberByBillerName(fromAccount.owner, biller.name);
        if (referenceNum) {
          finalReferenceNum = referenceNum;
        }

      } else {
        // Use manually entered biller details
        finalBillerName = data.billerName!;
        finalBillerCode = data.billerCode!;
        finalReferenceNum = data.referenceNum!;

        // Verify if manually entered biller details exist in the billers table
        const billers = await billerAction.fetchBillerByName(finalBillerName);
        // Ensure there's at least one biller matching the name
        if (billers.length === 0 || String(billers[0].biller_code) !== String(finalBillerCode)) {
          setError("Invalid biller name or biller code.");
          setIsLoading(false);
          return;
        }

        // Check if the reference number matches the one in biller_reference
        const referenceNum = await billerAction.fetchReferenceNumberByBillerName(fromAccount.owner, finalBillerName);
        if (referenceNum !== finalReferenceNum) {
          setError("Invalid reference number.");
          setIsLoading(false);
          return;
        }

      }

      const bills = await billAction.fetchAssignedBills(user_id, finalBillerName);

      // Check if no bills are assigned to the user
      if (bills.length === 0) {
        setError("No bills are assigned to you for this biller.");
        setIsLoading(false);
        return;
      }

      // Check if the user selected "schedule" or "recurring" payment
      if (data.paymentOption === "schedule" || data.paymentOption === "recurring") {

        const scheduleDate = data.paymentOption === "schedule" ? data.scheduleDate! : data.recurringStartDate!;
        const scheduleType = data.paymentOption === "schedule" ? 'bpay_schedule' : 'bpay_recur';

        if (data.paymentOption === "recurring") {
          scheduleAction.setScheduleType(scheduleType);
          scheduleAction.setPayInterval(data.frequency || 'weekly');

          // Handle different end conditions
          switch (data.endCondition) {
            case "untilFurtherNotice":
              scheduleAction.setRecurRule('untilFurtherNotice');
              break;
            case "setEndDate":
              scheduleAction.setRecurRule('endDate');
              scheduleAction.setEndDate(data.endDate!);
              break;
            case "numberOfPayments":
              scheduleAction.setRecurRule('numberOfPayments');
              scheduleAction.setRecurCount(parseInt(data.numberOfPayments!, 10));
              break;
          }
        }

        // Create a scheduled BPAY entry
        try {
          const scheduleRef = await scheduleAction.createScheduleEntry(
            fromAccount,
            null,
            finalBillerName,
            finalBillerCode,
            finalReferenceNum,
            amountF,
            data.description || '',
            scheduleDate,
            user_id
          );
        } catch (error) {
          console.error("Error Creating Schedule Entry:", error);
        }
      } else {
        // Call the createBPAYTransaction action
        await bpayAction.payBills(
          fromAccount,
          finalBillerName,
          finalBillerCode,
          finalReferenceNum,
          amountF,
          data.description || '',
          user_id,
        );
      }

      if (data.saveBiller) {
        // Check if billerName, billerCode, and referenceNum are filled
        if (data.billerName && data.billerCode && data.referenceNum) {
          try {
            await billerAction.addNewBiller(data.billerName, data.billerCode, data.referenceNum, fromAccount.owner);
          } catch (err) {
            console.error("Error saving biller:", err);
          }
        } else {
          console.warn("Biller details are incomplete. Biller will not be saved.");
        }
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
    <div className="flex">
      {/* Main Form Section */}
      <div className="w-4/5 p-4">

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
                              form.setValue("toBiller", id);  // Ensure the ID is treated as a number
                            }
                          }}
                          initialSelected={(form.getValues("toBiller")) || ''}
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

            {/* Save Biller Checkbox */}
            <FormField
              control={form.control}
              name="saveBiller"
              render={({ field }) => (
                <FormItem className="border-t border-gray-200">
                  <div className="payment-transfer_form-item pb-5 pt-6">
                    <div className="payment-transfer_form-content">
                      <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                        Save to my Billers
                      </FormLabel>
                      <FormDescription className="text-14 font-normal text-gray-600">
                        Save this biller's details for future transactions
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Checkbox
                        className="custom-checkbox"
                        checked={field.value === 1} // Check if the value is 1 for checked state
                        onCheckedChange={(checked) => field.onChange(checked ? 1 : 0)} // Toggle between 1 and 0
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />

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
                              form.setValue("fromBank", id);
                            }
                          }}
                          additionalOption={{ id: "-1", label: "Use Card" }}  // Add "Use Card" option
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

            {/* Card Details Section - Render only if the selected account is debit */}
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
      </div>

      {/* Right Sidebar/Panel - Only show when "Use Card" is selected */}
      <div
        className={`hidden xl:bottom-0 3xl:top-48 fixed bg-transparent xl:flex w-[380px] h-full transform transition-transform duration-500 ${showCardDetails ? 'translate-x-0 xl:right-0 2xl:right-10 3xl:right-24' : 'translate-x-full xl:right-0'
          }  xl:overflow-y-scroll 3xl:overflow-hidden overflow-x-hidden`}
        style={{ transitionTimingFunction: 'ease-in-out' }}
      >
        {<CardSidebar owner={accounts[0].owner} />}
      </div>


    </div>

  );
};

export default BPAYForm;
