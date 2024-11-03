import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/shadcn_ui/checkbox";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn_ui/select";
import { DatePicker } from "./DatePicker";
import { Input } from "@/components/shadcn_ui/input";



export const PaymentWhenOptions = () => {
  const form = useFormContext();
  const [recurringOption, setRecurringOption] = useState<"untilFurtherNotice" | "setEndDate" | "numberOfPayments">("untilFurtherNotice");
  const selectedPaymentOption = form.watch("paymentOption");

  return (
    <div>
      {/* Payment Options (Pay Now, Schedule Payment, Recurring Payment) */}
      <div className="border-t border-gray-200 flex w-full max-w-[850px] flex-col gap-12 md:flex-row lg:gap-20 pb-5 pt-6">
        <label className="flex justify-between items-center space-x-6">
          <span className="text-14 w-full max-w-[280px] font-medium text-gray-700">Pay Now</span>
          <Checkbox
            checked={selectedPaymentOption === "payNow"}
            onCheckedChange={() => form.setValue("paymentOption", "payNow")} // Set the value to "payNow"
            className="custom-checkbox"
          />
        </label>
        <label className="flex justify-between items-center space-x-6">
          <span className="text-14 w-full max-w-[280px] font-medium text-gray-700">Schedule Payment</span>
          <Checkbox
            checked={selectedPaymentOption === "schedule"}
            onCheckedChange={() => form.setValue("paymentOption", "schedule")} // Set the value to "schedule"
            className="custom-checkbox"
          />
        </label>
        <label className="flex justify-between items-center space-x-6">
          <span className="text-14 w-full max-w-[280px] font-medium text-gray-700">Recurring Payment</span>
          <Checkbox
            checked={selectedPaymentOption === "recurring"}
            onCheckedChange={() => form.setValue("paymentOption", "recurring")} // Set the value to "recurring"
            className="custom-checkbox" 
          />
        </label>
      </div>

      {/* Conditionally render date picker for scheduled payment */}
      {selectedPaymentOption === "schedule" && (
        <div className="flex flex-col space-y-2 mt-4 ">
          <label className="text-14 w-full max-w-[280px] font-medium text-gray-700">Select Payment Date</label>
          <DatePicker name="scheduleDate" />
        </div>
      )}

      {/* Show Frequency Dropdown and DatePicker if Recurring is selected */}
        {selectedPaymentOption === "recurring" && (
        <div className="w-full flex flex-col space-y-4 mt-4 ">

          {/* Frequency Dropdown */}
          <div className="flex flex-col">
          <label className="text-14 w-full max-w-[280px] font-medium text-gray-700 mb-4">Frequency</label>
          <Select
            value={form.watch("frequency")} // Ensure react-hook-form is watching the value
            onValueChange={(value) => form.setValue("frequency", value, { shouldValidate: true })} // Set the value with validation
          >
            <SelectTrigger className="w-[240px] bg-white-100">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent className="bg-white-100">
              <SelectGroup>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="fortnightly">Fortnightly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <p className="text-14 font-semibold text-red-500 mt-1">{form.formState.errors.frequency?.message as string}</p> {/* Error message */}
          </div>

        {/* Recurring Payment Start Date */}
        <div className="flex flex-col space-y-2">
          <label className="text-14 w-full max-w-[280px] font-medium text-gray-700">Select Start Date</label>
          <DatePicker name="recurringStartDate" />
        </div>

          {/* Instruction title */}
          <h3 className="text-14 font-semibold text-gray-900">
            Please select a set number of payments or an end date
          </h3>

          <div className="ml-4 space-y-4">
          {/* Until Further Notice */}
          <label className="flex justify-start items-center space-x-6">
            <span className="text-14 w-full max-w-[280px] font-medium text-gray-700">Until Further Notice</span>
            <Checkbox
              checked={recurringOption === "untilFurtherNotice"}
              onCheckedChange={() => {
                setRecurringOption("untilFurtherNotice");
                form.setValue("endCondition", "untilFurtherNotice");
              }}
              className="custom-checkbox"
            />
          </label>

          {/* Set End Date */}
          <label className="flex justify-start items-center space-x-6">
            <span className="text-14 w-full max-w-[280px] font-medium text-gray-700">Set End Date</span>
            <Checkbox
              checked={recurringOption === "setEndDate"}
              onCheckedChange={() => {
                setRecurringOption("setEndDate");
                form.setValue("endCondition", "setEndDate");
              }}
              className="custom-checkbox"
            />
          </label>
          {recurringOption === "setEndDate" && <DatePicker name="endDate" />}

          {/* Number of Payments */}
          <label className="flex justify-start items-center space-x-6">
            <span className="text-14 w-full max-w-[280px] font-medium text-gray-700">Number of Payments</span>
            <Checkbox
              checked={recurringOption === "numberOfPayments"}
              onCheckedChange={() => {
                setRecurringOption("numberOfPayments");
                form.setValue("endCondition", "numberOfPayments");
              }}
              className="custom-checkbox"
            />
          </label>
          {recurringOption === "numberOfPayments" && (
            <div className="flex flex-col">
              <Input
                placeholder="Enter number of payments"
                className="w-[240px] input-class bg-white-100"
                {...form.register("numberOfPayments", { required: true })}
              />
              
              {/* Display the error message with consistent styling */}
              {form.formState.errors.numberOfPayments && (
                <p className="text-14 font-semibold text-red-500 mt-1">
                  {form.formState.errors.numberOfPayments?.message as string}
                </p>
              )}
            </div>
          )}

          
          </div>

        </div>
      )}
    </div>
  );
};
