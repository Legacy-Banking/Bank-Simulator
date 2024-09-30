"use client"
import React, { useState, useRef } from 'react';
import { string } from 'zod';
interface SearchBarProps {
    inputValue: string;
    setInputValue: React.Dispatch<React.SetStateAction<string>>;
    setPage: React.Dispatch<React.SetStateAction<number>>;
  }
function SearchBar({ inputValue, setInputValue, setPage }: SearchBarProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleMagnifierClick = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const handleClearInput = () => {
        setInputValue('');
        setPage(1);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value); // Update input value
        setPage(1);                    // Reset page to 1 whenever input changes
    };
    return (
        <div className='w-64 h-10 border-[#D7D7D7] border-2 rounded-lg py-2 px-4 flex text-[#667085] font-semibold items-center'>
            {!inputValue && (
                <img
                    src="/magnifier.png"
                    className='mr-2 scale-75 transition-opacity duration-300 cursor-text opacity-100'
                    alt="search bar"
                    onClick={handleMagnifierClick}
                />
            )}
            <input
                ref={inputRef}
                placeholder="Search User"
                value={inputValue}
                onChange={handleInputChange}
                className="w-full outline-none focus:ring-0 bg-gray-100"
            />
            {inputValue && (
                <button
                    onClick={handleClearInput}
                    className="ml-2 text-[#667085] scale-125 transition-opacity duration-300 cursor-pointer focus:outline-none"
                >
                    &#x2715;
                </button>
            )}
        </div>
    );
}

export default SearchBar;
