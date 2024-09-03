"use client";

import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import * as z from "zod";

import { BankDropdown } from "./BankDropDown";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

// Placeholder function to create a transfer
const createTransfer = async (params: { fromBank: string; toBank: string; amount: string; note?: string }) => {
  // Implement your logic to create a transfer
  return true; // Assuming the transfer is successful
};

// Zod schema for form validation
const formSchema = z.object({
  fromBank: z.string().min(1, "Please select a valid bank account"),
  toBank: z.string().min(1, "Please select a valid bank account"),
  amount: z.string().min(1, "Amount is required").regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid amount"),
  note: z.string().optional(),
});

const TransferFundsForm = ({ accounts }: { accounts: Account[] }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromBank: "",
      toBank: "",
      amount: "",
      note: "",
    },
  });

  const submit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      const transferParams = {
        fromBank: data.fromBank,
        toBank: data.toBank,
        amount: data.amount,
        note: data.note,
      };

      // Create transfer
      const transfer = await createTransfer(transferParams);

      if (transfer) {
        form.reset();
        router.push("/");
      }
    } catch (error) {
      console.error("Submitting create transfer request failed: ", error);
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="flex flex-col">
        <FormField
          control={form.control}
          name="fromBank"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content">
                  <FormLabel className="text-14 font-medium text-gray-700">
                    From Bank Account
                  </FormLabel>
                  <FormDescription className="text-12 font-normal text-gray-600">
                    Select the bank account you want to transfer funds from
                  </FormDescription>
                </div>
                <div className="flex w-full flex-col">
                  <FormControl>
                  <BankDropdown
                    accounts={accounts}
                    onChange={(id) => form.setValue("fromBank", id || "")}  // This will set "fromBank" to null if nothing is selected
                    initialSelected={form.getValues("fromBank") || undefined}  // Starts blank if "fromBank" is not set
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
          name="toBank"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content">
                  <FormLabel className="text-14 font-medium text-gray-700">
                    To Bank Account
                  </FormLabel>
                  <FormDescription className="text-12 font-normal text-gray-600">
                    Select the bank account you want to transfer funds to
                  </FormDescription>
                </div>
                <div className="flex w-full flex-col">
                  <FormControl>
                  <BankDropdown
                    accounts={accounts}
                    onChange={(id) => form.setValue("toBank", id || "")}  // Replace setValue with onChange
                    initialSelected={form.getValues("toBank") || undefined}  // Set the initial selected bank
                    label="To Bank Account"  // Provide a descriptive label for the dropdown
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
                <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                  Amount
                </FormLabel>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input
                      placeholder="ex: 100.00"
                      className="input-class"
                      {...field}
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
          name="note"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content">
                  <FormLabel className="text-14 font-medium text-gray-700">
                    Transfer Note (Optional)
                  </FormLabel>
                  <FormDescription className="text-12 font-normal text-gray-600">
                    Provide additional information or instructions (optional)
                  </FormDescription>
                </div>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Textarea
                      placeholder="Write a short note here"
                      className="input-class"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <div className="payment-transfer_btn-box">
          <Button type="submit" className="text-14 w-full bg-blue-gradient font-semibold text-white-100 shadow-form">
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" /> &nbsp; Sending...
              </>
            ) : (
              "Transfer Funds"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TransferFundsForm;
