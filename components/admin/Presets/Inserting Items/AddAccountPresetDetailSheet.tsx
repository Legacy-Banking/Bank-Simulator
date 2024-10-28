import React, { useEffect, useState } from 'react';
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

// Define the props type for the component
type AccountPresetDetailSheetProps = {
  status: boolean;
  onClose: () => void;
  onAddStatus: () => void;
};



const AddAccountPresetDetailSheet: React.FC<AccountPresetDetailSheetProps> = ({ status, onClose, onAddStatus }) => {

  if (!status) return null;

  const [error, setError] = useState('');

  const [accountType, setAccountType] = useState('');
  const [startingBalance, setStartingBalance] = useState('');
  const [enumOptions, setEnumOptions] = useState<string[]>([]);


  const fetchEnumValues = async () => {
    const data = [
      {
        "account_type": "savings"
      },
      {
        "account_type": "personal"
      },
      {
        "account_type": "credit"
      },
      {
        "account_type": "debit"
      },
      {
        "account_type": "other"
      }
    ];

    setEnumOptions(data?.map((item: { account_type: string }) => item.account_type) || []);
  };

  useEffect(() => {
    fetchEnumValues();

  }, []);

  const addAccountPreset = async (accountType: string, startingBalance: string) => {
    // go to supabase and insert into the table

    setError(''); // Reset any existing errors

    // Check if all fields are filled in
    if (!accountType || !startingBalance) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      // Create Supabase client instance
      const supabase = createClient();

      // Insert the constant into the 'content_embeddings' table
      const { data, error } = await supabase
        .from('account_presets')
        .insert([
          {
            account_type: accountType,
            starting_balance: startingBalance,
            created_at: new Date(), // Optionally add a timestamp if needed
          }
        ]);

      if (error) {
        // Handle any error that occurs during insertion
        setError(`Failed to add constant: ${error.message}`);
      } else {
        // Handle successful insertion (optional)
        console.log('Account Preset added successfully:', data);
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
      <DialogContent className="bg-white-100 p-6" aria-description='account detail sheet'>
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold font-inter mb-3">Add Account Preset</DialogTitle>
        </DialogHeader>
        <form
        data-testid={'add-preset-detail-sheet'}
        className="flex flex-col w-full rounded-md text-[#344054]">
          <label className="">Account Type</label>
          <select
            className='rounded-md px-3 py-2 mt-2 border mb-6 outline-1 outline-blue-25 placeholder-gray-400 text-base drop-shadow-sm '
            title='Account Type'
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}>
            <option value="" disabled>
              Select Account Type
            </option>
            {enumOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>


          <label className="">Starting Balance</label>
          <input className="rounded-md px-3 py-2 mt-2 border mb-6 outline-1 outline-blue-25 placeholder-gray-400 text-base drop-shadow-sm "
            placeholder="e.g. 100000.00 [don't include commas, symbols, and spaces]"
            value={startingBalance}
            onChange={(e) => setStartingBalance(e.target.value)}
            required />

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
          <Button onClick={(e) => addAccountPreset(accountType, startingBalance)} className="grow uppercase font-inter tracking-wider bg-blue-25 hover:bg-blue-200 text-white-100">Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddAccountPresetDetailSheet;


