function accbsbGenerator(): { bsb: string, acc: string } {
    // Generate a 6-digit BSB number as a string
    const bsb = `${Math.floor(100000 + Math.random() * 900000)}`;

    // Generate a 9-digit account number as a string
    const acc = `${Math.floor(100000000 + Math.random() * 900000000)}`;

    return { bsb, acc };
}

export { accbsbGenerator };


function card_detailGenerator(): { card_num: string, expiry: string, cvv: string } {
    // Generate a 16-digit card number as a string
    const card_num = Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('');

    // Generate an expiry date in MM/YY format
    const currentYear = new Date().getFullYear();
    const month = Math.floor(Math.random() * 12) + 1; // Random month between 1 and 12
    const year = (currentYear % 100) + 5; // 5 years from now year 
    const expiry = `${month.toString().padStart(2, '0')}/${year.toString().padStart(2, '0')}`;

    // Generate a 3-digit CVV as a string
    const cvv = Math.floor(Math.random() * 900 + 100).toString(); // Random 3-digit number between 100 and 999

    return { card_num, expiry, cvv };
}

export { card_detailGenerator };

