"use client";
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

// Define the props type for the component
type AccountDetailSheetProps = {
  account: Account | null,
  status: boolean;
  onClose: () => void;
  updateAccount: () => void;
};

const EditAccountDetailSheet: React.FC<AccountDetailSheetProps> = ({ account, status, onClose, updateAccount }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const supabase = createClient();
    // Call Supabase to update the user's password
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setError('Failed to update password: ' + error.message);
    } else {
      setError('');
      setSuccess('Password updated successfully');
      updateAccount();
      onClose();
    }
  };

  if (!status) return null;

  return (
    <Dialog open={!!status} onOpenChange={onClose}>
      <DialogContent className="bg-white-100 p-6">
        <DialogHeader>
          
          <DialogTitle className="text-2xl font-semibold font-inter mb-8">Edit Details</DialogTitle>
        </DialogHeader>

        <form className="flex flex-col w-full rounded-md text-[#344054]">
          <label className="">Username</label>
          <input
            className="rounded-md px-3 py-2 mt-2 border mb-5 outline outline-1 outline-gray-400 text-base drop-shadow-sm read-only:bg-gray-100"
            placeholder={account?.owner_username}
            readOnly
          />

          <label className="">New Password</label>
          <input className="rounded-md px-3 py-2 mt-2 border mb-6 outline outline-1 outline-gray-400 placeholder-gray-400 text-base drop-shadow-sm " 
                  name="password" 
                  placeholder="Enter your password" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  required />

          <label className="">Re-Type New Password</label>
          <input className="rounded-md px-3 py-2 mt-2 border mb-6 outline outline-1 outline-gray-400 placeholder-gray-400 text-base drop-shadow-sm " 
                  name="password" 
                  placeholder="Enter your password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
          <Button onClick={handlePasswordUpdate} className="w-2/3 uppercase font-inter tracking-wider bg-blue-25 hover:bg-blue-200 text-white-100">Update</Button>
          <div className="mx-24"> </div>

          <Button onClick={onClose} className="w-1/3 uppercase font-inter border-2 hover:bg-slate-200 tracking-wider">Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditAccountDetailSheet;
