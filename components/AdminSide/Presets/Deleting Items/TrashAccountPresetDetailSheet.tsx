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

// Define the props type for the component
type AccountPresetDetailSheetProps = {
  accountPreset: AccountPresetType | null,
  status: boolean;
  onClose: () => void;
  deleteAccountPreset: () => void;
};



const TrashAccountDetailSheet: React.FC<AccountPresetDetailSheetProps> = ({ accountPreset, status, onClose, deleteAccountPreset }) => {
  if (!status) return null;



  const [error, setError] = useState('');

  const supabase = createClient();

  async function deleteAccountPresetById(accountPresetId: string | undefined) {
    if (!accountPresetId) {
      return;
    }
    const { data, error } = await supabase
      .from('account_presets') // Replace with your table name
      .delete()
      .eq('id', accountPresetId); // Match by accountPreset ID
  
    if (error) {
      setError(error.message);
      console.error('Error deleting Account Preset:', error.message);
    } else {
      setError('');
      console.log('Account Preset deleted:', data);
      deleteAccountPreset(); // Call parent function to refresh data
    }
  }
  

  return (
    <Dialog open={!!status} onOpenChange={onClose}>
      <DialogContent className="bg-white-100 p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold font-inter mb-10">Confirm Delete</DialogTitle>
          <DialogDescription className="text-base font-inter text-[#191919] border-blue-25 border-y-2 py-4">
          Are you sure you want to delete Account Preset <br />
          <span className='text-blue-25'>{accountPreset?.account_type}</span> permanently. <br /><br />
          You can’t undo this action.
          </DialogDescription>
        </DialogHeader>

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
          <Button onClick={(e) => deleteAccountPresetById(accountPreset?.id)} className="grow uppercase font-inter tracking-wider bg-blue-25 hover:bg-blue-200 text-white-100">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TrashAccountDetailSheet;
