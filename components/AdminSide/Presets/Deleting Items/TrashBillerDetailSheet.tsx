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
type BillerDetailSheetProps = {
  biller: Biller | null,
  status: boolean;
  onClose: () => void;
  deleteBiller: () => void;
};



const TrashAccountDetailSheet: React.FC<BillerDetailSheetProps> = ({ biller, status, onClose, deleteBiller }) => {
  if (!status) return null;



  const [error, setError] = useState('');

  const supabase = createClient();

  async function deleteBillerById(billerId: string | undefined) {
    if (!billerId) {
      return;
    }
    const { data, error } = await supabase
      .from('admin_presets_billers') // Replace with your table name
      .delete()
      .eq('id', billerId); // Match by biller ID
  
    if (error) {
      setError(error.message);
      console.error('Error deleting biller:', error.message);
    } else {
      setError('');
      console.log('Biller deleted:', data);
      deleteBiller(); // Call parent function to refresh data
    }
  }
  

  return (
    <Dialog open={!!status} onOpenChange={onClose}>
      <DialogContent className="bg-white-100 p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold font-inter mb-10">Confirm Delete</DialogTitle>
          <DialogDescription className="text-base font-inter text-[#191919] border-blue-25 border-y-2 py-4">
          Are you sure you want to delete biller permanently. <br />
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
          <Button onClick={(e) => deleteBillerById(biller?.id)} className="grow uppercase font-inter tracking-wider bg-blue-25 hover:bg-blue-200 text-white-100">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TrashAccountDetailSheet;
