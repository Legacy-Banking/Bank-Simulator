import { createClient } from "./supabase/client";
import { billerAction } from "./billerAction";
import { number } from "zod";

// Define types (Assuming they are declared elsewhere)
interface Bill {
    billed_user: string;
    from: string;
    description: string;
    amount: number;
    paid_on: Date;
    status: string;
    created_on: Date;
    due_date: Date;
}

interface Biller {
    name: string;
}

interface BillDetails {
    bill: Bill;
    biller: any; // Define the type according to your biller structure
}

export const billAction = {
    fetchBillsbyUserId: async (user_id: string): Promise<Bill[]> => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('bills')
            .select('*')
            .eq('billed_user', user_id);

        if (error) {
            throw new Error(error.message);
        }
        return data || [];
    },

    createBill: async (user_id: string, biller: Biller, amount: number, description: string): Promise<void> => {
        const supabase = createClient();
        const newBill: Bill = {
            billed_user: user_id,
            from: biller.name,
            description: description,
            amount: amount,
            paid_on: new Date(),
            status: 'unpaid',
            created_on: new Date(),
            due_date: new Date(),
        };

        const { data, error } = await supabase.from('bills').insert(newBill);

        if (error) {
            throw new Error(`Failed to create bill: ${error.message}`);
        }

        console.log('Bill created:', data);
    },

    fetchBillDetails: async (user_id: string): Promise<BillDetails[]> => {
        const bills = await billAction.fetchBillsbyUserId(user_id);
        const billerInfo: { [key: string]: any } = {};

        // Map over bills and fetch biller details asynchronously
        const billerDetails = await Promise.all(bills.map(async (bill) => {
            if (!billerInfo[bill.from]) {
                // Assuming fetchBillerByName is async
                billerInfo[bill.from] = (await billerAction.fetchBillerByName(bill.from)).flat()[0];
            }

            return {
                bill,
                biller: billerInfo[bill.from],
            };
        }));

        return billerDetails;
    },
     billItemRandomPartition : (amount: number): number[] => {
        const numItems = Math.floor(Math.random() * 5) + 1; // Random number of items (1-5)
        let remainingAmount = amount;
        const items: number[] = [];
        const minAmount = parseFloat((amount * 0.3).toFixed(2)); // 30% floor for each item
      
        for (let i = 0; i < numItems - 1; i++) {
          // Generate a random amount between the 30% floor and remainingAmount - (numItems - i - 1) * minAmount
          const maxAmount = remainingAmount - (numItems - i - 1) * minAmount;
          const item = parseFloat(
            (Math.random() * (maxAmount - minAmount) + minAmount).toFixed(2)
          );
          items.push(item);
          remainingAmount -= item;
        }
      
        // Push the remaining amount as the last item
        items.push(parseFloat(remainingAmount.toFixed(2)));
      
        return items;
      }
      
      
};