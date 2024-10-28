"use client";
import React, { useState, useEffect } from 'react';

interface PopUpProps {
  message: string;
  duration?: number; // duration in milliseconds
  onClose: () => void;
}

const PopUp: React.FC<PopUpProps> = ({ message, duration = 4000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    // Cleanup the timer on component unmount
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
    data-testid={message} 
    className="fixed bottom-4 left-4 bg-green-300 text-white px-6 py-3 rounded-md shadow-lg flex items-center">
      <span>{message}</span>
    </div>
  );
};

export default PopUp;
