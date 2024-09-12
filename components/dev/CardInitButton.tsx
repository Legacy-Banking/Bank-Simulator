import React from 'react';
import { cardAction } from '@/utils/cardAction'; // Adjust the import path if needed

const CardInitButton: React.FC<{ user_id: string }> = ({ user_id }) => {
    // Function to handle the button click
    const handleCardSignup = async () => {
        try {
            // Call the cardSignUpInitialization function
            await cardAction.cardSignUpInitialization(user_id);
            alert('Card creation successful!');
        } catch (error) {
            console.error('Error creating cards:', error);
            alert('Failed to create cards. Please try again.');
        }
    };

    return (
        <div>
            <button onClick={handleCardSignup} className="btn-signup bg-blue-100">
                Create Cards
            </button>
        </div>
    );
};

export default CardInitButton;
