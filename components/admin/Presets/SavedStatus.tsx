import React from 'react';

interface SavedStatusProps {
  status: boolean; // Define the type of the status prop
}

const SavedStatus: React.FC<SavedStatusProps> = ({ status }) => {
  // Apply conditional styling based on the status
  const style = status ? "bg-[#E1FFDC] text-[#07A104]" : "bg-[#FFCBCB] text-[#B55252]";

  return (
    <div
      className={`flex w-28 text-center justify-center ${style}  rounded-3xl `}
    >
        {status ? 'Yes' : 'No'}
    </div>
  );
};

export default SavedStatus;
