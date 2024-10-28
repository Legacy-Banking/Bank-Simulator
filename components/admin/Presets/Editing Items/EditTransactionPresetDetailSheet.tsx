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
  transactionPreset: TransactionPresetType | null,
  status: boolean;
  onClose: () => void;
  updateTransactionPreset: () => void;
};


const EditTransactionPresetDetailSheet: React.FC<TransactionPresetDetailSheetProps> = ({ transactionPreset, status, onClose, updateTransactionPreset }) => {

  if (!status) return null;
  const [transactionRecipient, setTransactionRecipient] = useState(transactionPreset?.recipient);
  const [dateIssued, setDateIssued] = React.useState<Date>(transactionPreset!.date_issued);
  const [amount, setAmount] = useState(transactionPreset?.amount.toString());


  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    if (typeof date === 'undefined') {
      return
    }
    setDateIssued(date);  // Set the selected date
    setPopoverOpen(false);  // Close the popover when date is selected
  };

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const supabase = createClient();
  // Function to update password by user ID
  const updateTransactionPresetById = async (
    transactionPresetId: string | undefined,
    transactionRecipient: string | undefined,
    dateIssued: Date,
    amount: string | undefined,
  ) => {
    if (!transactionPresetId) {
      return { success: false, message: "No Transaction Preset is selected" };
    }

    // Update the transactionPreset in the 'admin_presets_transactionPresets' table
    const { error } = await supabase
      .from('transaction_presets')
      .update({
        recipient: transactionRecipient,
        date_issued: dateIssued,
        amount: amount,
      })
      .eq('id', transactionPresetId); // Make sure to match by the transactionPreset's ID

    if (error) {
      console.error('Error updating Transaction Preset:', error.message);
      return { success: false, message: error.message };
    }
    updateTransactionPreset();
    return { success: true, message: 'Transaction Preset updated successfully' };
  };

  const handleDetailsUpdate = async () => {
    const transactionPresetId = transactionPreset?.id

    const result = await updateTransactionPresetById(transactionPresetId, transactionRecipient, dateIssued, amount);

    if (result.success) {
      console.log(result.message);
      // Show success notification
    } else {
      console.log(result.message);
      // Show error notification
    }
  };


  return (
    <Dialog open={!!status} onOpenChange={onClose}>
      <DialogContent className="bg-white-100 p-6">
        <DialogHeader>

          <DialogTitle className="text-2xl font-semibold font-inter mb-8">Edit Details</DialogTitle>
        </DialogHeader>

        <form className="flex flex-col w-full rounded-md text-[#344054]">
          <label className="">Recipient</label>
          <input className="rounded-md px-3 py-2 mt-2 border mb-6 outline-1 outline-blue-25 placeholder-gray-400 text-base drop-shadow-sm "
            placeholder="Enter recipient name e.g. (Jack Smith)"
            value={transactionRecipient}
            onChange={(e) => setTransactionRecipient(e.target.value)}
            required />


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
            className="rounded-md px-3 py-2 mt-2 border mb-5 outline-1 outline-blue-25 text-base drop-shadow-"
            placeholder="Enter amount (e.g. 12.41)"
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
          <Button onClick={handleDetailsUpdate} className="w-2/3 uppercase font-inter tracking-wider bg-blue-25 hover:bg-blue-200 text-white-100">Update</Button>
          <div className="mx-24"> </div>

          <Button onClick={onClose} className="w-1/3 uppercase font-inter border-2 hover:bg-slate-200 tracking-wider">Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTransactionPresetDetailSheet;
