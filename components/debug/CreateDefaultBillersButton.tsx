'use client';
import React from 'react';
import { billerAction } from '@/lib/actions/billerAction';

interface CreateDefaultBillersButtonProps {
  user_id: string;
}

const CreateDefaultBillersButton: React.FC<CreateDefaultBillersButtonProps> = ({ user_id }) => {
  const handleCreateDefaultBillers = async () => {
    try {
      await billerAction.createDefaultSavedBillers(user_id);
      console.log('Default billers created successfully.');
    } catch (error) {
      console.error('Error creating default billers:', error);
    }
  };

  return (
    <button
      onClick={handleCreateDefaultBillers}
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
    >
      Create Default Billers
    </button>
  );
};

export default CreateDefaultBillersButton;
