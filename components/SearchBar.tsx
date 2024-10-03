"use client";
import React, { useState, useRef } from 'react';

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
        <div className='relative w-64 h-10'>
            <input
                ref={inputRef}
                placeholder="Search Users"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full text-base h-full pl-12 pr-4 border-2 border-[#D7D7D7] rounded-lg focus:outline-none focus:ring focus:ring-[#99CCF3] focus:border-[#0052CC] bg-white-100 text-[#667085] font-semibold placeholder-[#667085]"
            />
            {!inputValue && (
                <img
                    src="/magnifier.png"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 scale-75 cursor-pointer"
                    alt="search bar"
                    onClick={handleMagnifierClick}
                />
            )}
            {inputValue && (
                <button
                    onClick={handleClearInput}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#667085] scale-125 cursor-pointer"
                >
                    &#x2715;
                </button>
            )}
        </div>
    );
}

export default SearchBar;
