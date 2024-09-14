import React from "react";

type HoverMessageProps = {
    message: string;
};

const HoverMessage: React.FC<HoverMessageProps> = ({ message }) => {
    return (
        <div className="absolute bg-gray-800 text-white p-2 rounded-md text-sm">
            {message}
        </div>
    );
};