"use client"
import React, { useState, useRef } from 'react';
import { Search } from "lucide-react"; // Import the Search icon from Lucide

interface SearchBarProps {
    inputValue: string;
    setInputValue: React.Dispatch<React.SetStateAction<string>>;
}

function SearchBar({ inputValue, setInputValue }: SearchBarProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleMagnifierClick = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const handleClearInput = () => {
        setInputValue('');
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    return (
        <div className='w-64 h-10 border-[#D7D7D7] border-2 rounded-lg py-2 px-4 flex bg-[#FFFF] text-[#667085] font-semibold items-center'>
            {!inputValue && (
                <Search
                    className='mr-2 scale-92 transition-opacity duration-300 cursor-text opacity-100'
                    onClick={handleMagnifierClick}
                />
            )}
            <input
                ref={inputRef}
                placeholder="Search Users"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full outline-none focus:ring-0"
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
