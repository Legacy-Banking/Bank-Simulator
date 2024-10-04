import React, { useEffect, useState } from 'react';
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
type AccountPresetDetailSheetProps = {
  accountPreset: AccountPresetType | null,
  status: boolean;
  onClose: () => void;
  updateAccountPreset: () => void;
};


const EditAccountPresetDetailSheet: React.FC<AccountPresetDetailSheetProps> = ({ accountPreset, status, onClose , updateAccountPreset}) => {

  if (!status) return null;
  const [accountPresetType, setAccountPresetType] = useState(accountPreset?.account_type);
  const [startingBalance, setStartingBalance] = useState(accountPreset?.starting_balance.toString());

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [enumOptions, setEnumOptions] = useState<string[]>([]);


  const fetchEnumValues = async () => {
    const data  = [
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
  const supabase = createClient();
  // Function to update password by user ID
const updateAccountPresetById = async (
  accountPresetId: string | undefined, 
  accountPresetType: string | undefined, 
  startingBalance: string | undefined, 
) => {
  if (!accountPresetId) {
    return { success: false, message: "No Account Preset is selected" };
  }

  // Update the accountPreset in the 'account_presets' table
  const { error } = await supabase
    .from('account_presets')
    .update({
      account_type: accountPresetType,
      starting_balance: startingBalance,
    })
    .eq('id', accountPresetId); // Make sure to match by the accountPreset's ID

  if (error) {
    console.error('Error updating accountPreset:', error.message);
    return { success: false, message: error.message };
  }
  updateAccountPreset();
  return { success: true, message: 'Account Preset updated successfully' };
};

const handleDetailsUpdate = async () => {
  const accountPresetId = accountPreset?.id 

  const result = await updateAccountPresetById(accountPresetId, accountPresetType, startingBalance);

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
          <label className="">Account Type</label>
          <select 
            className='rounded-md px-3 py-2 mt-2 border mb-6 outline-1 outline-blue-25 placeholder-gray-400 text-base drop-shadow-sm '
            title='Account Type'
            value={accountPresetType}
            onChange={(e) => setAccountPresetType(e.target.value)}>
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
          <input
            className="rounded-md px-3 py-2 mt-2 border mb-5 outline-1 outline-blue-25 text-base drop-shadow-"
            placeholder="Enter accountPreset name e.g. (Melbourne Hospital)"
            value={startingBalance}
            onChange={(e) => setStartingBalance(e.target.value)}
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

export default EditAccountPresetDetailSheet;
