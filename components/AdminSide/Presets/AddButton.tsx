import React from 'react';

interface AddButtonProps {
  onClick: () => void;
  disabled?: boolean; // Add disabled prop
}

const AddButton: React.FC<AddButtonProps> = ({ onClick, disabled }) => {
  return (
    <button
      onClick={disabled ? undefined : onClick} // Prevent click event when disabled
      className={`flex h-3/4 w-44 items-center justify-start px-4 rounded-lg shadow-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 ${disabled
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' // Styles for disabled state
          : 'bg-blue-200 text-white-100 hover:bg-blue-600'
        }`}
      disabled={disabled} // Set disabled attribute
    >
      <span className="text-3xl mr-3 pb-2">+</span>
      <span className="font-normal pb-1">Add</span>
    </button>
  );
};

export default AddButton;
