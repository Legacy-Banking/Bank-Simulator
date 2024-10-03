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


// Define the props type for the component
type ConstantDetailSheetProps = {
  constant: Constant | null,
  status: boolean;
  onClose: () => void;
  updateConstant: () => void;
};


const EditConstantDetailSheet: React.FC<ConstantDetailSheetProps> = ({ constant, status, onClose , updateConstant}) => {

  if (!status) return null;
  const [key, setKey] = useState(constant?.key);
  const [content, setContent] = useState(constant?.content);
  const [pageKey, setPageKey] = useState(constant?.page_key);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [enumOptions, setEnumOptions] = useState<string[]>([]);

  const supabase = createClient();
  // Function to update password by user ID
const updateConstantById = async (
  constantId: string | undefined, 
  key: string | undefined, 
  content: string | undefined, 
  pageKey: string | undefined
) => {
  if (!constantId) {
    return { success: false, message: "No constant is selected" };
  }

  // Update the constant in the 'admin_presets_constants' table
  const { error } = await supabase
    .from('content_embeddings')
    .update({
      key: key,
      content: content,
      page_key: pageKey,
    })
    .eq('id', constantId); // Make sure to match by the constant's ID

  if (error) {
    console.error('Error updating constant:', error.message);
    return { success: false, message: error.message };
  }
  updateConstant();
  return { success: true, message: 'Constant updated successfully' };
};

const fetchEnumValues = async () => {
  const data  = [
    {
      "page_key_values": "admin"
    },
    {
      "page_key_values": "view_bills"
    },
    {
      "page_key_values": "default_dashboard"
    },
    {
      "page_key_values": "admin_dashboard"
    },
    {
      "page_key_values": "inbox"
    },
    {
      "page_key_values": "bpay"
    },
    {
      "page_key_values": "transfer_funds"
    },
    {
      "page_key_values": "login"
    },
    {
      "page_key_values": "signup"
    },
    {
      "page_key_values": "pay_anyone"
    },
    {
      "page_key_values": "home"
    }
  ];
  
  setEnumOptions(data?.map((item: { page_key_values: string }) => item.page_key_values) || []);
};
  useEffect(() => {
    fetchEnumValues();

  }, [])



const handleDetailsUpdate = async () => {
  const constantId = constant?.id // Replace with the actual user ID from your app logic

  const result = await updateConstantById(constantId, key, content, pageKey);

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
          <label className="">Key</label>
          <input className="rounded-md px-3 py-2 mt-2 border mb-6 outline outline-1 outline-gray-400 placeholder-gray-400 text-base drop-shadow-sm " 
                  placeholder="Enter constant code e.g. (1022)"  
                  value={key} 
                  onChange={(e) => setKey(e.target.value)} 
                  required />
          

          <label className="">Content</label>
          <textarea
            className="rounded-md px-3 py-2 mt-2 border mb-5 outline outline-1 outline-gray-400 text-base drop-shadow-"
            placeholder="Enter constant name e.g. (Melbourne Hospital)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <label className="">Page Key</label>
          <select 
            className='rounded-md px-3 py-2 mt-2 border mb-6 outline outline-1 outline-gray-400 placeholder-gray-400 text-base drop-shadow-sm '
            title='Page Key'
            value={pageKey} 
            onChange={(e) => setPageKey(e.target.value)}>
              {enumOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
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

export default EditConstantDetailSheet;
