function accbsbGenerator(): { bsb: string, acc: string } {
    // Generate a 6-digit BSB number as a string
    const bsb = `${Math.floor(100000 + Math.random() * 900000)}`;

    // Generate a 9-digit account number as a string
    const acc = `${Math.floor(100000000 + Math.random() * 900000000)}`;

    return { bsb, acc };
}

function billerCodeGenerator():string{
    //return a 4-6 digit biller code
    return `${Math.floor(1000 + Math.random() * 9000)}`;
}

export { accbsbGenerator, billerCodeGenerator };
