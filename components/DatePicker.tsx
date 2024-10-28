import React from "react";
import { useFormContext } from "react-hook-form";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "./shadcn_ui/button";
import { Calendar } from "./shadcn_ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "./shadcn_ui/popover";
import { FormField, FormItem, FormControl, FormMessage } from "./shadcn_ui/form";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  name: string;
}

export const DatePicker = ({ name }: DatePickerProps) => {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className=" py-2">
          <div className="flex w-full flex-col space-y-4">
            <FormControl>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "bg-white-100 w-[240px] pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 text-blue-500 " />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white-100" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()} // Disable past dates
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage className="text-12 text-red-500" />
          </div>
        </FormItem>
      )}
    />
  );
};
