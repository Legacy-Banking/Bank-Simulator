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
type ConstantDetailSheetProps = {
  status: boolean;
  onClose: () => void;
  onAddStatus: () => void;
};



const AddConstantDetailSheet: React.FC<ConstantDetailSheetProps> = ({ status, onClose, onAddStatus}) => {
  
  if (!status) return null;
  
  const [error, setError] = useState('');

  const [key, setKey] = useState('');
  const [content, setContent] = useState('');
  const [pageKey, setPageKey] = useState('');
  const [enumOptions, setEnumOptions] = useState<string[]>([]);


  const supabase = createClient();
  const fetchEnumValues = async () => {
    const { data, error } = await supabase.rpc('get_page_keys');

    if (error) {
      console.error('Error fetching enum values:', error.message);
    } else {
      setEnumOptions(data?.map((item: { page_key: string }) => item.page_key) || []);
    }
  };
  
  fetchEnumValues();

  const addConstant = async (key : string, content : string, pageKey : string) => {
    // go to supabase and insert into the table
    
    setError(''); // Reset any existing errors

  // Check if all fields are filled in
  if (!key|| !content || !pageKey) {
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
          <DialogTitle className="text-2xl font-semibold font-inter mb-10">Add Constant</DialogTitle>
          <DialogDescription className="text-base font-inter text-[#191919] border-blue-25 border-y-2 py-4">
          </DialogDescription>
        </DialogHeader>
            <form className="flex flex-col w-full rounded-md text-[#344054]">
            <label className="">Key</label>
            <input
                className="rounded-md px-3 py-2 mt-2 border mb-5 outline outline-1 outline-gray-400 text-base drop-shadow-sm read-only:bg-gray-100"
                placeholder="e.g. title"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                required
            />

            <label className="">Content</label>
            <input className="rounded-md px-3 py-2 mt-2 border mb-6 outline outline-1 outline-gray-400 placeholder-gray-400 text-base drop-shadow-sm " 
                    placeholder="e.g. Learning to store money and be rich!" 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} 
                    required />

            <label className="">Page Key</label>
            <select 
            className='rounded-md px-3 py-2 mt-2 border mb-6 outline outline-1 outline-gray-400 placeholder-gray-400 text-base drop-shadow-sm '
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
          <Button onClick={(e) => addConstant(key, content, pageKey)} className="grow uppercase font-inter tracking-wider bg-blue-25 hover:bg-blue-200 text-white-100">Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddConstantDetailSheet;


