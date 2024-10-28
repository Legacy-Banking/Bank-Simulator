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
import { createClient } from '@/lib/supabase/client';

// Define the props type for the component
type ConstantDetailSheetProps = {
  status: boolean;
  onClose: () => void;
  onAddStatus: () => void;
};



const AddConstantDetailSheet: React.FC<ConstantDetailSheetProps> = ({ status, onClose, onAddStatus }) => {

  if (!status) return null;

  const [error, setError] = useState('');

  const [key, setKey] = useState('');
  const [content, setContent] = useState('');
  const [pageKey, setPageKey] = useState('');
  const [enumOptions, setEnumOptions] = useState<string[]>([]);


  const fetchEnumValues = async () => {
    const data = [
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

  }, []);

  const addConstant = async (key: string, content: string, pageKey: string) => {
    // go to supabase and insert into the table

    setError(''); // Reset any existing errors

    // Check if all fields are filled in
    if (!key || !content || !pageKey) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      // Create Supabase client instance
      const supabase = createClient();

      // Insert the constant into the 'content_embeddings' table
      const { data, error } = await supabase
        .from('content_embeddings')
        .insert([
          {
            key: key,
            content: content,
            page_key: pageKey,
            created_at: new Date(), // Optionally add a timestamp if needed
          }
        ]);

      if (error) {
        // Handle any error that occurs during insertion
        setError(`Failed to add constant: ${error.message}`);
      } else {
        // Handle successful insertion (optional)
        console.log('Constant added successfully:', data);
        onClose(); // Close the dialog after adding the constant
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
          <DialogTitle className="text-2xl font-semibold font-inter mb-3">Add Constant</DialogTitle>
        </DialogHeader>
        <form 
        data-testid={'constant-add-detail-sheet'}
        className="flex flex-col w-full rounded-md text-[#344054]">
          <label className="">Key</label>
          <input
            className="rounded-md px-3 py-2 mt-2 border mb-5 outline-1 outline-blue-25 text-base drop-shadow-sm read-only:bg-gray-100"
            placeholder="e.g. title"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            required
          />

          <label className="">Content</label>
          <input className="rounded-md px-3 py-2 mt-2 border mb-6 outline-1 outline-blue-25 placeholder-gray-400 text-base drop-shadow-sm "
            placeholder="e.g. Learning to store money and be rich!"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required />

          <label className="">Page Key</label>
          <select
            className='rounded-md px-3 py-2 mt-2 border mb-6 outline-1 outline-blue-25 placeholder-gray-400 text-base drop-shadow-sm '
            title='Page Key'
            value={pageKey}
            onChange={(e) => setPageKey(e.target.value)}>
            <option value="" disabled>
              Select Page Key
            </option>
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
          <Button onClick={onClose} className="grow uppercase font-inter border-2 hover:bg-slate-200 tracking-wider">Cancel</Button>
          <Button 
          data-testid={'success-add-constant'}
          onClick={(e) => addConstant(key, content, pageKey)} className="grow uppercase font-inter tracking-wider bg-blue-25 hover:bg-blue-200 text-white-100">Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddConstantDetailSheet;


