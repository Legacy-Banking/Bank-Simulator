import React from "react";

type HoverMessageProps = {
    message: string;
    children: React.ReactNode;
    position?: "top-right" | "bottom-left" | "top-left" | "bottom-right";
};

const HoverMessage: React.FC<HoverMessageProps> = ({ message, children, position }) => {
    const getPosition = () => {
        switch (position) {
            case "top-right":
                return "-top-12 -right-12";
            case "bottom-right":
                return "-bottom-12 -right-12";
            case "top-left":
                return "-top-12 -left-12";
            case "bottom-left":
                return "-bottom-12 -left-12";
            default:
                return "top-0 right-0";
        }
    }
    return (
        <div className="relative group inline-block">
            {/* Target component to hover over */}
            {children}

            {/* Message shown on hover, positioned below */}
            <div className={`absolute ${getPosition()} max-w-32 mt-2 bg-white-100 text-gray-900 p-3 rounded-md text-sm shadow-lg border border-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                {message}
            </div>
        </div>
    );
};

export default HoverMessage;
