"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowLeft } from "lucide-react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/DatePicker";
import { billAction } from "@/lib/actions/billAction";
import { billerAction } from "@/lib/actions/billerAction";
import { BillerDropdown } from '@/components/BillerDropDown';

const formSchema = z.object({
  biller: z.string().min(1, "Please select a valid biller"),
  amount: z.string().min(1, "Amount is required").regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid amount"),
  dueDate: z.date().refine((date) => date >= new Date(), "Please select a valid due date"),
  description: z.string().max(300, "Description must be 300 characters or less").optional(),
});


interface CreateBillFormProps {
  setIsCreatingBill: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateBillForm: React.FC<CreateBillFormProps> = ({ setIsCreatingBill }) => {
  // Handle Back/Cancel button click
  const handleBackClick = () => {
    setIsCreatingBill(false); // Switch back to Admin Bills view
  };

  const [billers, setBillers] = useState<Biller[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // State to manage error messages

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      biller: "",
      amount: "",
      dueDate: undefined,
      description: "",
    },
  });

  // Fetch billers
  useEffect(() => {
    const fetchBillers = async () => {
      try {
        const data = await billerAction.fetchAllBillers();
        setBillers(data || []);
      } catch (error) {
        console.error("Failed to fetch billers:", error);
        setError("Failed to fetch billers");
      }
    };

    fetchBillers();
  }, []);


  const submit = async (data: z.infer<typeof formSchema>) => {
    setError(null); // Clear previous error
    setIsLoading(true);

    try {
      const selectedBiller = billers.find(biller => String(biller.id) === data.biller);

      if (!selectedBiller) {
        throw new Error("Invalid biller selected.");
      }

      // Convert dueDate to UTC
      const dueDateUTC = new Date(
        Date.UTC(data.dueDate.getFullYear(), data.dueDate.getMonth(), data.dueDate.getDate())
      );

      await billAction.createAdminBill(
        data.biller,
        parseFloat(data.amount),
        dueDateUTC,
        data.description || ""
      );

      console.log("Admin bill created successfully");

      form.reset();
      handleBackClick(); // Navigate back to the bills page after submission
    } catch (error) {
      console.error("Submitting create bill request failed: ", error);

      // Handle error properly
      if (error instanceof Error) {
        setError(error.message || "An error occurred during the bill creation.");
      } else {
        setError("An unexpected error occurred during the bill creation.");
      }
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="flex flex-col">
        {/* Back Button */}
        <Button
          onClick={handleBackClick}
          className="mb-6 w-fit bg-gray-100 hover:bg-gray-300 text-gray-700 text-base flex items-center"
        >
          <ArrowLeft className="mr-2" /> Back
        </Button>

        <div className="flex flex-col gap-1 pb-5">
          <h2 className="text-18 font-semibold text-gray-900">Step 1 - Biller Details</h2>
          <p className="text-14 font-normal text-gray-600">Enter the details of the biller</p>
        </div>

        {/* Biller Dropdown */}
        <FormField
          control={form.control}
          name="biller"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content">
                  <FormLabel className="text-14 font-medium text-gray-700">Select Biller</FormLabel>
                  <FormDescription className="text-12 font-normal text-gray-600">
                    Select the biller you want the to assign to the bill
                  </FormDescription>
                </div>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <BillerDropdown
                      billerAccounts={billers} // Pass billers array here
                      onChange={(id) => {
                        if (id) {
                          form.setValue("biller", id);  // Ensure the ID is treated as a number
                          console.log("Biller Changed: ", id);
                        }
                      }}
                      //initialSelected={(form.getValues("biller")) || ''}
                      label="Select Biller"
                      otherStyles="!w-full"
                    />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500 mt-1" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <div className="payment-transfer_form-details">
          <h2 className="text-18 font-semibold text-gray-900">Setup 2 - Bill Details</h2>
          <p className="text-14 font-normal text-gray-600">Enter the bill details</p>
        </div>

        {/* Amount Input */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item py-5">
                <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700 mt-2">Amount</FormLabel>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input placeholder="Enter amount" className="input-class bg-white-100" {...field} />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500 mt-1" />
                </div>
              </div>
            </FormItem>
          )}
        />

        {/* Due Date Input */}
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item py-5">
                <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700 mt-4">Due Date</FormLabel>
                <div className="flex w-full flex-col">
                  <DatePicker name="dueDate" />

                </div>
              </div>
            </FormItem>
          )}
        />

        {/* Bill Description Input */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content">
                  <FormLabel className="text-14 font-medium text-gray-700">Bill Description (Optional)</FormLabel>
                  <FormDescription className="text-12 font-normal text-gray-600">
                    Provide additional information or instructions (optional)
                  </FormDescription>
                </div>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Textarea placeholder="Write a short description here" className="input-class bg-white-100" {...field} />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500 mt-1" />
                </div>
              </div>
            </FormItem>
          )}
        />

        {error && <p className="text-red-500 mt-4">{error}</p>} {/* Display error message if any */}

        {/* Submit Button */}
        <div className="payment-transfer_btn-box">
          <Button type="submit" className="text-14 w-full bg-blue-gradient font-semibold text-white-100 shadow-form">
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" /> &nbsp; Creating Bill...
              </>
            ) : (
              "Create Bill"
            )}
          </Button>
        </div>
      </form>
    </Form>

  );
};

export default CreateBillForm;
