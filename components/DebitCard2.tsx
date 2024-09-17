import { useState } from 'react';

const DebitCard2 = (
    {type, name, cardNumber, expirationDate, maxSpending, spending}: 
    {type : string, name : string, cardNumber : number, expirationDate : Date, maxSpending : number, spending : number}
)  => {
    // State to track the spending amount (you can replace this with real data)

    const formattedExpirationDate = expirationDate.toLocaleDateString('en-US', {
        year: '2-digit',
        month: '2-digit',
      });

    const formatCardNumber = (number: string) => {
        return number.replace(/\d{4}(?=\d)/g, "$& ");
    };
    return (
        <div className="flex flex-col max-w-80">
            
            <div className="h-48 w-80 bg-cover bg-no-repeat mb-2" style={{backgroundImage: "url('./debit-2-clear.png')"}}>
                
                {/* Card Type */}
                <div className='relative top-4 left-4 text-white-200 font-semibold text-lg'>{type}</div>
            
                {/* Cardholder Name */}
                <div className="relative -bottom-24 left-4 text-white-200 text-sm font-manrope tracking-widest">
                    {name.toUpperCase()}
                </div>

                {/* Card Number */}
                <div className="relative -bottom-24 -right-4 text-white-200 text-lg tracking-widest font-manrope">
                    {formatCardNumber(cardNumber.toString())}    
                </div>

                {/* Expiration Date */}
                <div className="relative -bottom-12 -right-44 text-white-200 text-xs font-manrope">
                    {formattedExpirationDate}
                </div>

            </div>

            {/* Spending Info and Progress Bar */}
            <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-700 font-inter ">
                    <span className="font-medium">Spending this month</span>
                    <span>${spending.toFixed(2)}</span>
                </div>

                {/* Spending Progress */}
                <div className="relative h-2 mt-2 bg-gray-200 rounded-full">
                    <div
                        className="absolute top-0 left-0 h-2 bg-blue-500 rounded-full"
                        style={{ width: `${(spending / maxSpending) * 100}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default DebitCard2;
