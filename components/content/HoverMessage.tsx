import React from "react";

type HoverMessageProps = {
    message: string;
    children: React.ReactNode;
};

const HoverMessage: React.FC<HoverMessageProps> = ({ message, children }) => {
    return (
        <div className="relative group inline-block">
            {/* Target component to hover over */}
            {children}

            {/* Message shown on hover, positioned below */}
            <div className="absolute -right-12 -top-12 max-w-32 mt-2 bg-white-100 text-gray-900 p-3 rounded-md text-sm shadow-lg border border-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {message}
            </div>
        </div>
    );
};

export default HoverMessage;
