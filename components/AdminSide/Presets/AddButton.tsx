import React from 'react';

interface AddButtonProps {
  onClick: () => void;
}

const AddButton: React.FC<AddButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      aria-label="Add Button"
      className="flex h-3/4 w-44 items-center justify-start bg-blue-200 text-white-100 px-4 rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      <span className="text-3xl mr-3 pb-2">+</span>
      <span className="font-normal pb-1">Add</span>
    </button>
  );
};

export default AddButton;
