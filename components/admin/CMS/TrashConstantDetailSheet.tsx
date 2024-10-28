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

// Define the props type for the component
type ConstantDetailSheetProps = {
  constant: Constant | null,
  status: boolean;
  onClose: () => void;
  deleteConstant: () => void;
};



const TrashConstantDetailSheet: React.FC<ConstantDetailSheetProps> = ({ constant, status, onClose, deleteConstant }) => {
  if (!status) return null;

  const [error, setError] = useState('');

  const supabase = createClient();

  async function deleteConstantById(constantId: string | undefined) {
    if (!constantId) {
      return;
    }
    const { data, error } = await supabase
      .from('content_embeddings') // Replace with your table name
      .delete()
      .eq('id', constantId); // Match by constant ID

    if (error) {
      setError(error.message);
      console.error('Error deleting constant:', error.message);
    } else {
      setError('');
      console.log('Constant deleted:', data);
      deleteConstant(); // Call parent function to refresh data
    }
  }


  return (
    <Dialog open={!!status} onOpenChange={onClose}>
      <DialogContent className="bg-white-100 p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold font-inter mb-10">Confirm Delete</DialogTitle>
          <DialogDescription className="text-base font-inter text-[#191919] border-blue-25 border-y-2 py-4">
            Are you sure you want to delete constant <br />
            <span className='text-blue-25'>{constant?.key}</span> permanently. <br /> <br />
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
          <Button onClick={(e) => deleteConstantById(constant?.id)} className="grow uppercase font-inter tracking-wider bg-blue-25 hover:bg-blue-200 text-white-100">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TrashConstantDetailSheet;
