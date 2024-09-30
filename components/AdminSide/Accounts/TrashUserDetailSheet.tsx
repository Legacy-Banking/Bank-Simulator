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
type UserDetailSheetProps = {
  account: Account | null,
  status: boolean;
  onClose: () => void;
  deleteUser: () => void;
};



const TrashUserDetailSheet: React.FC<UserDetailSheetProps> = ({ account, status, onClose, deleteUser }) => {
  if (!status) return null;

  const [error, setError] = useState('');

  const supabase = createClient();

  async function deleteAccountsByOwnerUsername(ownerUsername: string | undefined) {
    if (!ownerUsername) {
      return;
    }
  
    try {
      // Delete cards based on owner_username first (since they have a foreign key constraint)
      const { data: cardData, error: cardError } = await supabase
        .from('cards') // Replace with your cards table name
        .delete()
        .eq('owner_username', ownerUsername); // Match by owner_username
  
      if (cardError) {
        throw new Error(`Error deleting cards: ${cardError.message}`);
      } else {
        console.log('Cards deleted:', cardData);
      }
  
      // Now delete accounts based on owner_username
      const { data: accountData, error: accountError } = await supabase
        .from('account') // Replace with your accounts table name
        .delete()
        .eq('owner_username', ownerUsername); // Match by owner_username
  
      if (accountError) {
        throw new Error(`Error deleting accounts: ${accountError.message}`);
      } else {
        console.log('Users deleted:', accountData);
      }
  
      // Call parent function or refresh data after deletion
      deleteUser(); // Assuming you have a function to refresh the data
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
        console.error('Error occurred: ', error.message);
      } else {
        console.error('Unexpected error occurred', error);
      }
    }
  }
  
  
  
  
  

  return (
    <Dialog open={!!status} onOpenChange={onClose}>
      <DialogContent className="bg-white-100 p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold font-inter mb-10">Confirm Delete</DialogTitle>
          <DialogDescription className="text-base font-inter text-[#191919] border-blue-25 border-y-2 py-4">
          Are you sure you want to delete user <span className="text-blue-500">{account?.owner_username}</span> permanently? <br />
          <br />
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
          <Button onClick={(e) => deleteAccountsByOwnerUsername(account?.owner_username)} className="grow uppercase font-inter tracking-wider bg-blue-25 hover:bg-blue-200 text-white-100">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TrashUserDetailSheet;
