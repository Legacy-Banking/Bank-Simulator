import { useState } from 'react';

const DebitCardBack = (
    {cvc}: 
    {cvc : number}
)  => {
    // State to track the spending amount (you can replace this with real data)

    return (
        <div className="flex flex-col max-w-80">
            
            <div className="h-48 w-80 bg-cover bg-no-repeat" style={{backgroundImage: "url('./debit-1-back-clear.png')"}}>
                
                <div className="relative top-20 mt-2 left-64 text-lg tracking-widest font-manrope font-bold">
                {cvc}
                </div>



            </div>

            
        </div>
    );
};

export default DebitCardBack;
