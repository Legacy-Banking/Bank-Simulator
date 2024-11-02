import { useState } from 'react';
import { Tooltip } from 'react-tooltip';

const DebitCard = (
    { type, name, cardNumber, expirationDate, maxSpending, cvc, linkedAccount }:
        { type: string, name: string, cardNumber: string, expirationDate: Date, maxSpending: number, cvc: number, linkedAccount: Account | undefined }
) => {
    // State to track the spending amount (you can replace this with real data)

    const formattedExpirationDate = expirationDate.toLocaleDateString('en-US', {
        year: '2-digit',
        month: '2-digit',
    });

    function formatToCurrency(amount: number | undefined): string {
        if (!amount) {
            return '$0.00';
        }
        const formattedAmount = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(amount);

        return formattedAmount;
    }

    const formatCardNumber = (number: string) => {
        return number.replace(/\d{4}(?=\d)/g, "$& ");
    };

    function abbreviateName(fullName: string) {
        const nameParts = fullName.split(' ');

        if (nameParts.length === 1) {
            return fullName;
        }

        const abbreviatedParts = nameParts.map((part, index) => {
            if (index === nameParts.length - 1) {
                return part;
            } else {
                return part.charAt(0).toUpperCase() + '.';
            }
        });

        return abbreviatedParts.join(' ');
    }

    return (
        <div className="max-w-200 flex gap-10 flex-wrap">
            <div className="flex flex-col max-w-80">
                <div className="h-48 w-80 bg-cover bg-no-repeat mb-2"
                    style={{ backgroundImage: "url('./debit-1-clear.png')" }}
                    data-tooltip-id='card-tip'>

                    {/* Card Type */}
                    <div className='relative top-4 left-4 text-white-200 font-semibold text-lg'>{type}</div>

                    {/* Card Number */}
                    <div className="relative -bottom-20 -right-4 text-white-200 text-base tracking-widest font-manrope">
                        {formatCardNumber(cardNumber.toString())}
                    </div>

                    {/* Cardholder Name */}
                    <div className="relative -bottom-24 left-4 text-white-200 text-sm font-manrope tracking-widest">
                        {abbreviateName(name)}
                    </div>

                    {/* Expiration Date */}
                    <div className="relative -bottom-20 -right-44 text-white-200 text-xs font-manrope">
                        {formattedExpirationDate}
                    </div>
                </div>

                {/* Spending Info and Progress Bar */}
                <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-700 font-inter ">
                        <span className="font-medium">Linked to <i>Personal Account</i></span>
                        <span>{formatToCurrency(linkedAccount?.balance)}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col max-w-80">
                <div className="h-48 w-80 bg-cover bg-no-repeat" style={{ backgroundImage: "url('./debit-1-back-clear.png')" }}>
                    <div className="relative top-20 mt-2 left-64 text-lg tracking-widest font-manrope font-bold italic">
                        {cvc}
                    </div>
                </div>
            </div>
            <Tooltip id="card-tip" place="top" className="max-w-sm text-sm bg-gray-800 text-white p-2 rounded shadow-lg z-50">
                In real life your bank will provide you with a physical card that looks like this.
                The important information is the card number(the long string of numbers), expiration date(the 4 digits separated with a '/'), and CVC code(3 digits on the back).
                Don't share this information with anyone!
            </Tooltip>
        </div>
    );
};

export default DebitCard;
