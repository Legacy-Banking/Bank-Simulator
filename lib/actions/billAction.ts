import { createClient } from "../supabase/client";
import { billerAction } from "./billerAction";
import { number } from "zod";
import { referenceNumberGenerator, generateUniqueInvoiceNumber, calculateDueDate } from "../utils/accbsbGenerator"
import { inboxAction } from "./inboxAction";

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
        const updatedBills = await billAction.updateOverdueBills(data);
        const sortedBills = billAction.sortBill(updatedBills);
        // const sortedBills = billAction.sortBill(data);

        return sortedBills;
    },

    updateOverdueBills: async (bills: Bill[]): Promise<Bill[]> => {
        const supabase = createClient();
        const currentDate = new Date();

        // Loop through each bill and check if it's overdue
        const overdueBills = bills.filter(bill => {
            const dueDate = new Date(bill.due_date);
            return (bill.status === 'unpaid' || bill.status === 'partial') && dueDate < currentDate;
        });

        // Update the status of overdue bills
        if (overdueBills.length > 0) {
            const invoiceNumbers = overdueBills.map(bill => bill.invoice_number);

            const { error } = await supabase
                .from('bills')
                .update({ status: 'overdue' })
                .in('invoice_number', invoiceNumbers);

            if (error) {
                throw new Error(`Failed to update overdue bills: ${error.message}`);
            }

            // Update the local list of bills
            overdueBills.forEach(bill => {
                bill.status = 'overdue';
            });
        }

        return bills;
    },

    fetchBillsByUserIdAndBillerName: async (user_id: string, biller_name: string): Promise<Bill[]> => {
        const supabase = createClient();

        // Query to filter bills by both user_id and biller_name
        const { data, error } = await supabase
            .from('bills')
            .select('*')
            .eq('billed_user', user_id)
            .eq('from', biller_name);
        if (error) {
            throw new Error(error.message);
        }

        // Sort bills using the existing sortBill function
        const sortedBills = billAction.sortBill(data);

        return sortedBills;
    },
    sortBill: (bills: Bill[]): Bill[] => {
        const statusPriority: { [key: string]: number } = {
            overdue: 0,
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
            await inboxAction.createMessage(biller.name, user_id, messageDescription, 'bill', invoiceNumber, '', '');
        } catch (messageError) {
            console.error('Failed to send message to user:', messageError);
            // Handle the message error gracefully if necessary
        }
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
            assigned_users,
            preset_status,
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
                    await inboxAction.createMessage(biller.name, user_id, messageDescription, 'bill', invoiceNumber, linkedBill, '');
                } catch (messageError) {
                    console.error(`Failed to send message to user ${user_id}:`, messageError);
                    // Handle the message error gracefully if necessary
                }
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

    fetchAssignedUsersById: async (billId: string) => {
        const supabase = createClient();
        try {
            const { data, error } = await supabase
                .from('admin_bills') // Replace 'admin_bills' with the actual table name in your database
                .select('assigned_users')
                .eq('id', billId)
                .single(); // We expect a single row since we are fetching by ID

            if (error) {
                throw new Error(`Failed to fetch assigned users: ${error.message}`);
            }

            if (!data) {
                throw new Error('No assigned users found with the given ID');
            }

            return data; // The 'data' will contain the fields from the row in the admin_bills table

        } catch (error) {
            console.error('Error fetching assigned users by ID:', error);
            throw error;
        }
    },

    // Fetch admin bill by its ID
    fetchAdminBillById: async (billId: string) => {
        const supabase = createClient();
        try {
            const { data, error } = await supabase
                .from('admin_bills') // Replace 'admin_bills' with the actual table name in your database
                .select('id, biller, amount, description, due_date, assigned_users, created_at, preset_status')
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

    fetchAssignedUsersStatus: async (selectedBill: AdminBillWithBiller): Promise<{ name: string; status: string }[]> => {
        const supabase = createClient();

        try {
            // Get the assigned users string from the selected bill
            const assignedUsersString = selectedBill.assigned_users || '';

            // Split the string by ',' to get individual pairs of username|userid
            const assignedUserPairs = assignedUsersString ? assignedUsersString.split(',') : [];

            if (assignedUserPairs.length === 0) {
                return [];
            }

            // Optimize the query by only fetching once and filtering in the database
            const userIds = assignedUserPairs.map(pair => pair.split('|')[1]).filter(id => id);

            // Query all users at once, avoiding multiple API calls
            const { data: usersData, error } = await supabase
                .from('bills')
                .select('billed_user, status')
                .in('billed_user', userIds)
                .eq('linked_bill', selectedBill.id);  // Ensure it’s linked to the correct bill

            if (error) {
                console.error('Error fetching users by UUID:', error.message);
                return assignedUserPairs.map(() => ({ name: 'Unknown', status: 'unpaid' }));
            }

            // Match the users with their statuses and return
            const assignedUsersDetails = assignedUserPairs.map(pair => {
                const [username, userId] = pair.split('|');
                const userStatus = usersData?.find(u => u.billed_user === userId)?.status || 'unpaid';
                return {
                    name: username || 'Unknown',
                    status: userStatus
                };
            });

            return assignedUsersDetails;
        } catch (error) {
            console.error('Error fetching assigned users:', error);
            throw error;
        }
    },

    fetchPresetBills: async (): Promise<any[]> => {
        const supabase = createClient();

        // Fetch bills where preset_status is true
        const { data: adminBills, error: fetchError } = await supabase
            .from('admin_bills')
            .select('biller, description, amount, due_date, id')
            .eq('preset_status', true); // Filter for preset bills

        if (fetchError) {
            throw new Error(`Error fetching bills: ${fetchError.message}`);
        }

        if (!adminBills || adminBills.length === 0) {
            throw new Error("No preset bills found to insert.");
        }

        // Fetch the corresponding biller details for each bill from the name
        const billsWithBillerDetails = await Promise.all(
            adminBills.map(async (bill) => {
                const billerDetails = await billerAction.fetchBillerByName(bill.biller);
                if (!billerDetails.length) {
                    throw new Error(`Biller ${bill.biller} not found.`);
                }

                return {
                    ...bill, // Include the original bill details
                    biller: billerDetails[0], // Replace the biller name with the full biller details
                };
            })
        );

        // Return the bills with the full biller details
        return billsWithBillerDetails;
    },
    
    updatePresetStatus: async (billId: string, newStatus: boolean): Promise<void> => {
        const supabase = createClient();

        try {
            // Update the preset_status field in the admin_bills table
            const { error } = await supabase
                .from('admin_bills')
                .update({ preset_status: newStatus })
                .eq('id', billId);

            // Check if there was an error with the update
            if (error) {
                throw new Error(`Failed to update preset status for bill ${billId}: ${error.message}`);
            }
        } catch (error) {
            console.error('Error updating preset status:', error);
            throw error; // Re-throw the error for further handling if needed
        }
    },


};
