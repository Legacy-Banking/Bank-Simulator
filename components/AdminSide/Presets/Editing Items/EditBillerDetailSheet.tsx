import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn, formatAmount, formatDateTime } from "@/lib/utils"

import { createClient } from '@/utils/supabase/client';
import { create } from 'domain';
import Switch from '@mui/material/Switch';


// Define the props type for the component
type BillerDetailSheetProps = {
  biller: Biller | null,
  status: boolean;
  onClose: () => void;
  updateBiller: () => void;
};


const EditBillerDetailSheet: React.FC<BillerDetailSheetProps> = ({ biller, status, onClose , updateBiller}) => {

  if (!status) return null;
  const [billerCode, setBillerCode] = useState(biller?.biller_code);
  const [billerName, setBillerName] = useState(biller?.name);
  const [checked, setChecked] = React.useState(biller?.save_biller_status);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const supabase = createClient();
  // Function to update password by user ID
const updateBillerById = async (
  billerId: string | undefined, 
  billerCode: string | undefined, 
  billerName: string | undefined, 
) => {
  if (!billerId) {
    return { success: false, message: "No biller is selected" };
  }

  // Update the biller in the 'admin_presets_billers' table
  const { error } = await supabase
    .from('billers')
    .update({
      biller_code: billerCode,
      name: billerName,
      save_biller_status: checked,
    })
    .eq('id', billerId); // Make sure to match by the biller's ID

  if (error) {
    console.error('Error updating biller:', error.message);
    return { success: false, message: error.message };
  }
  updateBiller();
  return { success: true, message: 'Biller updated successfully' };
};

const handleDetailsUpdate = async () => {
  const billerId = biller?.id // Replace with the actual user ID from your app logic

  const result = await updateBillerById(billerId, billerCode, billerName);

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
          <label className="">Biller Code</label>
          <input className="rounded-md px-3 py-2 mt-2 border mb-6 outline-1 outline-blue-25 placeholder-gray-400 text-base drop-shadow-sm " 
                  placeholder="Enter biller code e.g. (1022)"  
                  value={billerCode} 
                  onChange={(e) => setBillerCode(e.target.value)} 
                  required />
          

          <label className="">Biller Name</label>
          <input
            className="rounded-md px-3 py-2 mt-2 border mb-5 outline-1 outline-blue-25 text-base drop-shadow-"
            placeholder="Enter biller name e.g. (Melbourne Hospital)"
            value={billerName}
            onChange={(e) => setBillerName(e.target.value)}
            required
          />
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
          <Button onClick={handleDetailsUpdate} className="w-2/3 uppercase font-inter tracking-wider bg-blue-25 hover:bg-blue-200 text-white-100">Update</Button>
          <div className="mx-24"> </div>

          <Button onClick={onClose} className="w-1/3 uppercase font-inter border-2 hover:bg-slate-200 tracking-wider">Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditBillerDetailSheet;
