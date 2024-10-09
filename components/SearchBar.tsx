"use client"
import React, { useState, useRef } from 'react';
import { Search } from "lucide-react"; // Import the Search icon from Lucide
import { Input } from '@/components/ui/input'; // Shadcn Input component
import { Button } from '@/components/ui/button'; // Shadcn Button component

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
        <div className="relative flex items-center w-64">
        {/* Search Icon */}
        <div className="absolute left-3 text-gray-500 cursor-pointer" onClick={handleMagnifierClick}>
          <Search className="h-5 w-5" />
        </div>
  
        {/* Shadcn Input component */}
        <Input
          ref={inputRef}
          placeholder="Search Users"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="pl-10 pr-10" // Add padding to leave space for icons
        />
  
        {/* Clear Button */}
        {inputValue && (
          <Button
            onClick={handleClearInput}
            className="absolute right-0 text-gray-500 cursor-pointer focus:outline-none"
          >
            &#x2715;
          </Button>
        )}
      </div>
    );
}

export default SearchBar;
