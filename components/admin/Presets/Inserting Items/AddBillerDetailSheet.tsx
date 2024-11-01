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
import { cn, formatAmount, formatDateTime } from "@/lib/utils/utils"
import { createClient } from '@/lib/supabase/client';
import Switch from '@mui/material/Switch';
// Define the props type for the component
type BillerDetailSheetProps = {
  status: boolean;
  onClose: () => void;
  onAddStatus: () => void;
};



const AddBillerDetailSheet: React.FC<BillerDetailSheetProps> = ({ status, onClose, onAddStatus }) => {

  if (!status) return null;

  const [error, setError] = useState('');

  const [billerCode, setBillerCode] = useState('');
  const [billerName, setBillerName] = useState('');
  const [checked, setChecked] = React.useState(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };
  const addBiller = async (billerCode: string, billerName: string) => {
    // go to supabase and insert into the table

    setError(''); // Reset any existing errors

    // Check if all fields are filled in
    if (!billerCode || !billerName) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      // Create Supabase client instance
      const supabase = createClient();

      // Insert the biller into the 'admin_presets_billers' table
      const { data, error } = await supabase
        .from('billers')
        .insert([
          {
            biller_code: billerCode,
            name: billerName,
            save_biller_status: checked,
            created_at: new Date(), // Optionally add a timestamp if needed
          }
        ]);

      if (error) {
        // Handle any error that occurs during insertion
        setError(`Failed to add biller: ${error.message}`);
      } else {
        onClose(); // Close the dialog after adding the biller
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
          <DialogTitle className="text-2xl font-semibold font-inter mb-4">Add Biller</DialogTitle>
        </DialogHeader>
        <form 
        data-testid={'add-preset-detail-sheet'}
        className="flex flex-col w-full rounded-md text-[#344054]">
          <label className="">Biller Code</label>
          <input
            className="rounded-md px-3 py-2 mt-2 border mb-5 outline-1 outline-blue-25 text-base drop-shadow-sm read-only:bg-gray-100"
            placeholder="e.g. 1022"
            value={billerCode}
            onChange={(e) => setBillerCode(e.target.value)}
            required
          />
          <label className="">Biller Name</label>
          <input className="rounded-md px-3 py-2 mt-2 border mb-6 outline-1 outline-blue-25 placeholder-gray-400 text-base drop-shadow-sm "
            placeholder="Melbourne Hospital"
            value={billerName}
            onChange={(e) => setBillerName(e.target.value)}
            required />
          <div className="my-3"></div>

          <label className="">Save Biller Status?</label>
          <Switch
            checked={checked}
            onChange={handleChange}
            inputProps={{ 'aria-label': 'controlled' }}
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
          <Button onClick={(e) => addBiller(billerCode, billerName)} className="grow uppercase font-inter tracking-wider bg-blue-25 hover:bg-blue-200 text-white-100">Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddBillerDetailSheet;


