import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/shadcn_ui/dialog';
import { Button } from '@/components/shadcn_ui/button';
import { cn, formatAmount, formatDateTime } from "@/lib/utils"
import { createClient } from '@/lib/supabase/client';
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover';
import { setDate } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/shadcn_ui/calendar';
import { format } from "date-fns"

import { date } from 'zod';

// Define the props type for the component
type TransactionPresetDetailSheetProps = {
  status: boolean;
  onClose: () => void;
  onAddStatus: () => void;
};



const AddTransactionPresetDetailSheet: React.FC<TransactionPresetDetailSheetProps> = ({ status, onClose, onAddStatus }) => {

  if (!status) return null;

  const [error, setError] = useState('');

  const [recipient, setRecipient] = useState('');
  const [dateIssued, setDateIssued] = React.useState<Date>()
  const [amount, setAmount] = useState('');
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    setDateIssued(date);  // Set the selected date
    setPopoverOpen(false);  // Close the popover when date is selected
  };

  const addTransactionPreset = async () => {
    // go to supabase and insert into the table

    setError(''); // Reset any existing errors

    // Check if all fields are filled in
    if (!recipient || !dateIssued || !amount) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      // Create Supabase client instance
      const supabase = createClient();

      // Insert the constant into the 'content_embeddings' table
      const { data, error } = await supabase
        .from('transaction_presets')
        .insert([
          {
            recipient: recipient,
            date_issued: dateIssued,
            amount: amount,
            created_at: new Date(), // Optionally add a timestamp if needed
          }
        ]);

      if (error) {
        // Handle any error that occurs during insertion
        setError(`Failed to add transaction preset: ${error.message}`);
      } else {
        // Handle successful insertion (optional)
        console.log('Transaction Preset added successfully:', data);
        onClose(); // Close the dialog after adding the constant
        onAddStatus();
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(`An error occurred: ${err.message}`);
      } else {
        setError('An unknown error occurred');
      }
    }
  };


  return (
    <Dialog open={!!status} onOpenChange={onClose}>
      <DialogContent className="bg-white-100 p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold font-inter mb-3">Add Transaction Preset</DialogTitle>
        </DialogHeader>
        <form 
        data-testid={'add-preset-detail-sheet'}
        className="flex flex-col w-full rounded-md text-[#344054]">
          <label className="">Recipient</label>
          <input
            className="rounded-md px-3 py-2 mt-2 border mb-5 outline-1 outline-blue-25 text-base drop-shadow-sm read-only:bg-gray-100"
            placeholder="e.g. Jack Smith"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            required
          />

          <label className="py-2">Date Issued</label>
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal bg-white-200",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateIssued ? format(dateIssued, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-slate-100 z-[9999] pt-4">
              <Calendar
                initialFocus
                mode="single"
                selected={dateIssued}
                onSelect={handleDateSelect}
              />
            </PopoverContent>
          </Popover>
          <label className="pt-6">Amount</label>
          <input
            className="rounded-md px-3 py-2 mt-2 border mb-5 outline-1 outline-blue-25 text-base drop-shadow-sm read-only:bg-gray-100"
            placeholder="e.g. 1000 means Jack Smith pays this person $1000.00 do (-)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </form>
        {/* Error Message */}
        {error && (
          <div className="text-red-200">
            *<Button className="delete" onClick={() => setError('')}></Button>
            {error}
          </div>
        )}

        {/* Footer with Close button */}
        <DialogFooter className="mt-8 flex ">
          <Button onClick={onClose} className="grow uppercase font-inter border-2 hover:bg-slate-200 tracking-wider">Cancel</Button>
          <Button onClick={(e) => addTransactionPreset()} className="grow uppercase font-inter tracking-wider bg-blue-25 hover:bg-blue-200 text-white-100">Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionPresetDetailSheet;


