import { createClient } from "./supabase/client";
import { billerAction } from "./billerAction";
import { number } from "zod";
import { referenceNumberGenerator, generateUniqueInvoiceNumber, calculateDueDate } from "./accbsbGenerator"
import { inboxAction } from "./inboxAction";

const fetchBillerCode = async (billerName: string) => {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('billers')
        .select('biller_code')
        .eq('name', billerName)
        .single(); // single() ensures you're only fetching one record

    if (error) {
        throw new Error(`Error fetching biller_code: ${error.message}`);
    }

    return data.biller_code;
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
        const sortedBills = billAction.sortBill(data);

        return sortedBills;
    },
    sortBill: (bills: Bill[]): Bill[] => {
        const statusPriority: { [key: string]: number } = {
            unpaid: 1,
            partial: 2,
            pending: 3,
            paid: 4
        };

        const sortedBills = bills.sort((a: Bill, b: Bill) => {
            // Sort by status based on the defined priority (lower number has higher priority)
            const statusA = statusPriority[a.status] || 5; // Default to 5 if status is unknown
            const statusB = statusPriority[b.status] || 5;

            if (statusA !== statusB) {
                return statusA - statusB;
            }

            // Ensure due_date is a Date object before comparing
            const dueDateA = new Date(a.due_date);
            const dueDateB = new Date(b.due_date);

            // Sort by due date (earliest first)
            return dueDateA.getTime() - dueDateB.getTime();
        });

        return sortedBills;
    },

    createBill: async (user_id: string, biller: Biller, amount: number, description: string): Promise<void> => {
        const supabase = createClient();

        //Fetch the reference number from user_billers if it exists
        let referenceNumber = await billerAction.fetchReferenceNumberByBillerName(user_id, biller.name);
        // If no reference number found, generate a new one
        if (!referenceNumber) {
            referenceNumber = referenceNumberGenerator();
            // Add this reference number to the user's biller_reference list
            await billerAction.addReferenceNumber(user_id, biller.name, referenceNumber);
        }

        const invoiceNumber = await generateUniqueInvoiceNumber();

        const newBill: Partial<Bill> = {
            billed_user: user_id,
            from: biller.name,
            description: description,
            amount: amount,
            paid_on: new Date(),
            status: 'unpaid',
            created_at: new Date(),
            due_date: calculateDueDate(),
            invoice_number: invoiceNumber,
            reference_number: referenceNumber,
        };

        const { data, error } = await supabase.from('bills').insert(newBill);

        if (error) {
            throw new Error(`Failed to create bill: ${error.message}`);
        }
        const messageDescription = `A new bill of $${amount} has been assigned to you from ${biller.name}. Please pay by ${newBill.due_date!.toLocaleDateString()}.`;

        try {
            await inboxAction.createMessage(biller.name, user_id, messageDescription, 'bill', invoiceNumber, "");
            console.log('Message sent to user about new bill');
        } catch (messageError) {
            console.error('Failed to send message to user:', messageError);
            // Handle the message error gracefully if necessary
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
    billItemRandomPartition: (amount: number): number[] => {
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
    },
    fetchAssignedBills: async (user_id: string, biller_name: string): Promise<Partial<Bill>[]> => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('bills')
            .select('*')
            .eq('billed_user', user_id)
            .eq('from', biller_name)
            .neq('status', 'paid')
            .neq('status', 'pending');
        if (error) {
            throw error;
        }
        return data;
    },

    updateBillStatus: async (bill: Partial<Bill>, status: string): Promise<void> => {
        const invoice_number = bill.invoice_number;
        const supabase = createClient();
        const { data, error } = await supabase
            .from('bills')
            .update({ status })
            .eq('invoice_number', invoice_number);
        if (error) {
            throw error;
        }
    },
    updateBillAmount: async (bill: Partial<Bill>, amount: number): Promise<void> => {
        const invoice_number = bill.invoice_number;
        const supabase = createClient();
        const { data, error } = await supabase
            .from('bills')
            .update({ amount })
            .eq('invoice_number', invoice_number);
        if (error) {
            throw error;
        }
    },

    // fetchAdminBills: async (): Promise<AdminBill[]> => {
    //     const supabase = createClient();
    //     const { data, error } = await supabase
    //       .from('admin_bills') 
    //       .select('*');

    //     if (error) {
    //       throw new Error(`Failed to fetch admin bills: ${error.message}`);
    //     }

    //     return data;
    //   },

    fetchAdminBills: async (): Promise<AdminBillWithBiller[]> => {
        const supabase = createClient();

        const { data, error } = await supabase
            .from('admin_bills')
            .select(`
            id, 
            amount, 
            description, 
            due_date, 
            biller: biller ( id, name, biller_code, biller_details )
          `);

        if (error) {
            throw new Error(`Failed to fetch bills: ${error.message}`);
        }

        // Ensure each bill's 'biller' field is a single object, not an array
        const formattedData = data.map((bill: any) => ({
            ...bill,
            biller: Array.isArray(bill.biller) ? bill.biller[0] : bill.biller // Extract the first element if biller is an array
        }));

        return formattedData as AdminBillWithBiller[]; // Cast to AdminBillWithBiller[]
    },


    createAdminBill: async (
        biller_id: string,
        amount: number,
        due_date: Date,
        description: string
    ): Promise<void> => {
        const supabase = createClient();

        const { name: biller_name } = await billerAction.fetchBillerById(biller_id);

        const newBill = {
            biller: biller_name,      // Reference to the biller
            amount: amount,            // Amount of the bill
            due_date: due_date,        // Due date of the bill
            description: description,  // Optional bill description
            created_at: new Date(),    // Timestamp of when the bill was created
        };

        const { data, error } = await supabase
            .from('admin_bills')       // Insert into 'admin_bills' table
            .insert([newBill]);        // Insert a new bill row

        if (error) {
            throw new Error(`Failed to create admin bill: ${error.message}`);
        }

        console.log("Admin bill created:", data);
    },

    deleteAdminBillWithReferences: async (billId: string): Promise<void> => {
        const supabase = createClient();

        try {
            // Start a transaction to ensure all deletions happen atomically
            const { error: deleteBillError } = await supabase
                .from('bills')
                .delete()
                .match({ linked_bill: billId });

            if (deleteBillError) {
                throw new Error(`Failed to delete bills with linked bill: ${deleteBillError.message}`);
            }

            const { error: deleteMessagesError } = await supabase
                .from('messages')
                .delete()
                .match({ linked_bill: billId });

            if (deleteMessagesError) {
                throw new Error(`Failed to delete messages with linked bill: ${deleteMessagesError.message}`);
            }

            // Finally, delete the admin bill itself
            const { error: deleteAdminBillError } = await supabase
                .from('admin_bills') // Assuming your admin bill table is called 'admin_bills'
                .delete()
                .eq('id', billId);

            if (deleteAdminBillError) {
                throw new Error(`Failed to delete admin bill: ${deleteAdminBillError.message}`);
            }

            console.log(`Successfully deleted admin bill and its related entries for bill ID: ${billId}`);

        } catch (error) {
            console.error('Failed to delete admin bill and its references:', error);
            throw error; // Propagate the error to be caught in the calling function
        }
    },

    unassignAdminBill: async (selectedUsers: string[], linkedBill: string) => {
        const supabase = createClient();

        try {
            // Remove user references in the "bills" table
            await supabase
                .from("bills")
                .delete()
                .in("billed_user", selectedUsers) // assuming user_id is the field for users in "bills" table
                .eq("linked_bill", linkedBill);

            // Remove user references in the "messages" table
            await supabase
                .from("messages")
                .delete()
                .in("to_user", selectedUsers) // assuming user_id is the field for users in "messages" table
                .eq("linked_bill", linkedBill);

            console.log("References successfully removed from bills and messages");
        } catch (error) {
            if (error instanceof Error) {
                console.error("Failed to unassign users:", error.message);
            } else {
                console.error("Unknown error occurred:", error);
            }
            throw error;
        }
    },

    createBillForUsers: async (user_ids: string[], biller: Biller, amount: number, description: string, dueDate: Date, linkedBill: string): Promise<void> => {
        const supabase = createClient();
        console.log("IN Creating Bill Form")
        for (const user_id of user_ids) {
            try {
                // Fetch the reference number from user_billers if it exists
                let referenceNumber = await billerAction.fetchReferenceNumberByBillerName(user_id, biller.name);

                // If no reference number found, generate a new one
                if (!referenceNumber) {
                    referenceNumber = referenceNumberGenerator();
                    // Add this reference number to the user's biller_reference list
                    await billerAction.addReferenceNumber(user_id, biller.name, referenceNumber);
                }

                // Generate a unique invoice number for this bill
                const invoiceNumber = await generateUniqueInvoiceNumber();

                // Create the new bill object
                const newBill: Partial<Bill> = {
                    billed_user: user_id,
                    from: biller.name,
                    description: description,
                    amount: amount,
                    paid_on: new Date(),
                    status: 'unpaid',
                    created_at: new Date(),
                    due_date: dueDate,
                    invoice_number: invoiceNumber,
                    reference_number: referenceNumber,
                    linked_bill: linkedBill,
                };

                // Insert the bill into the 'bills' table
                const { data, error } = await supabase.from('bills').insert(newBill);

                if (error) {
                    throw new Error(`Failed to create bill for user ${user_id}: ${error.message}`);
                }

                // Send a message to the user inbox about the new bill
                const messageDescription = `A new bill of $${amount} has been assigned to you from ${biller.name}. Please pay by ${newBill.due_date!.toLocaleDateString()}.`;

                try {
                    await inboxAction.createMessage(biller.name, user_id, messageDescription, 'bill', invoiceNumber, linkedBill);
                    console.log(`Message sent to user ${user_id} about new bill.`);
                } catch (messageError) {
                    console.error(`Failed to send message to user ${user_id}:`, messageError);
                    // Handle the message error gracefully if necessary
                }

                console.log(`Bill created for user ${user_id}:`, data);
            } catch (err) {
                console.error(`Failed to create bill for user ${user_id}:`, err);
            }
        }
    },

    updateAssignedUsers: async (billId: string, assignedUsers: string) => {
        const supabase = createClient();

        const { error } = await supabase
            .from('admin_bills')
            .update({ assigned_users: assignedUsers })
            .eq('id', billId);

        if (error) {
            throw new Error(`Failed to update assigned users for bill ${billId}: ${error.message}`);
        }
    },

    // Fetch admin bill by its ID
    fetchAdminBillById: async (billId: string) => {
        const supabase = createClient();
        try {
            const { data, error } = await supabase
                .from('admin_bills') // Replace 'admin_bills' with the actual table name in your database
                .select('id, biller, amount, description, due_date, assigned_users')
                .eq('id', billId)
                .single(); // We expect a single row since we are fetching by ID

            if (error) {
                throw new Error(`Failed to fetch admin bill: ${error.message}`);
            }

            if (!data) {
                throw new Error('No admin bill found with the given ID');
            }

            return data; // The 'data' will contain the fields from the row in the admin_bills table

        } catch (error) {
            console.error('Error fetching admin bill by ID:', error);
            throw error;
        }
    },
};
