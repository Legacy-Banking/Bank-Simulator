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
  status: boolean;
  onClose: () => void;
};



const AddBillerDetailSheet: React.FC<BillerDetailSheetProps> = ({ status, onClose}) => {
  
  if (!status) return null;
  
  const [error, setError] = useState('');

  const [billerCode, setBillerCode] = useState('');
  const [billerName, setBillerName] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');

  const addBiller = (billerCode : string, billerName : string, referenceNumber : string) => {
      

    
  };
  return (
    <Dialog open={!!status} onOpenChange={onClose}>
      <DialogContent className="bg-white-100 p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold font-inter mb-10">Add Biller</DialogTitle>
          <DialogDescription className="text-base font-inter text-[#191919] border-blue-25 border-y-2 py-4">
          </DialogDescription>
        </DialogHeader>
            <form className="flex flex-col w-full rounded-md text-[#344054]">
            <label className="">Biller Code</label>
            <input
                className="rounded-md px-3 py-2 mt-2 border mb-5 outline outline-1 outline-gray-400 text-base drop-shadow-sm read-only:bg-gray-100"
                placeholder="e.g. 1022"
                value={billerCode}
                onChange={(e) => setBillerCode(e.target.value)}
                required
            />

            <label className="">Biller Name</label>
            <input className="rounded-md px-3 py-2 mt-2 border mb-6 outline outline-1 outline-gray-400 placeholder-gray-400 text-base drop-shadow-sm " 
                    placeholder="Melbourne Hospital" 
                    value={billerName} 
                    onChange={(e) => setBillerName(e.target.value)} 
                    required />

            <label className="">Reference Number</label>
            <input className="rounded-md px-3 py-2 mt-2 border mb-6 outline outline-1 outline-gray-400 placeholder-gray-400 text-base drop-shadow-sm " 
                    placeholder="1231 1414 1232 1112" 
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
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
          <Button onClick={(e) => addBiller(billerCode, billerName, referenceNumber)} className="grow uppercase font-inter tracking-wider bg-blue-25 hover:bg-blue-200 text-white-100">Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddBillerDetailSheet;


