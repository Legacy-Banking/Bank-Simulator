import { createClient } from "../supabase/client";

function accbsbGenerator(): { bsb: string, acc: string } {
    // Generate a 6-digit BSB number as a string
    const bsb = `${Math.floor(100000 + Math.random() * 900000)}`;

    // Generate a 9-digit account number as a string
    const acc = `${Math.floor(100000000 + Math.random() * 900000000)}`;

    return { bsb, acc };
}

function card_detailGenerator(): { card_num: string, expiry: Date, cvv: string } {
    // Generate a 16-digit card number as a string
    const card_num = Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('');

    // Get the current year and create an expiration date 5 years from now
    const currentYear = new Date().getFullYear();
    const randomMonth = Math.floor(Math.random() * 12); // Random month between 0 and 11 for Date object
    const expiryYear = currentYear + 5;

    // Create the expiry date as the first day of the selected month 5 years from now
    const expiry = new Date(expiryYear, randomMonth, 1);

    // Generate a 3-digit CVV as a string
    const cvv = Math.floor(Math.random() * 900 + 100).toString(); // Random 3-digit number between 100 and 999

    return { card_num, expiry, cvv };
}

function billerCodeGenerator():string{
    //return a 4-6 digit biller code
    return `${Math.floor(1000 + Math.random() * 9000)}`;
}

function referenceNumberGenerator(): string {
    // Generate a 12-digit reference number as a string
    return `${Math.floor(100000000000 + Math.random() * 900000000000)}`;
}


// Function to generate a new reference number (12 digits)
const generateReferenceNumber = (): string => {
  return `${Math.floor(100000000000 + Math.random() * 900000000000)}`;
};

/// Generate a unique invoice number
const generateUniqueInvoiceNumber = async (): Promise<string> => {
    const supabase = createClient();

  
    // Fetch the latest invoice number from the bills table
    const { data: latestBill, error } = await supabase
      .from('bills')
      .select('id')
      .order('id', { ascending: false })
      .limit(1)
      .single();
  
    if (error) {
      console.error("Error fetching the latest invoice number:", error.message);
      throw new Error(`Failed to fetch latest invoice number: ${error.message}`);
    }
  
  
    // If there's a previous invoice number, increment it. Start from 20200 if none exists
    let nextInvoiceNumber = 'INV/20200';
    if (latestBill && latestBill.id) {
        // Add the latest ID to 20200 to generate the next invoice number
        const nextNumber = 20200 + latestBill.id + 1;
        nextInvoiceNumber = `INV/${nextNumber}`;
        console.log("Generated next invoice number based on bill ID:", nextInvoiceNumber);
      } else {
        console.log("No existing bills found, using default invoice number:", nextInvoiceNumber);
    }
  
    return nextInvoiceNumber;
  };
  
  // Calculate a due date for the bill (default is 30 days from creation)
  const calculateDueDate = (): Date => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30); // Add 30 days from today
    return dueDate;
  };

export { accbsbGenerator, billerCodeGenerator, referenceNumberGenerator, card_detailGenerator, generateUniqueInvoiceNumber,
    calculateDueDate, };


