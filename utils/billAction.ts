import { createClient } from "./supabase/client";
import { billerAction } from "./billerAction";
import { number } from "zod";
import { referenceNumberGenerator, generateUniqueInvoiceNumber, calculateDueDate } from "./accbsbGenerator"
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
            await inboxAction.createMessage(biller.name, user_id, messageDescription, 'bill', invoiceNumber);
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
    },
    fetchAssignedBills: async (user_id:string,biller_name:string):Promise<Partial<Bill>[]>=>{
        const supabase = createClient();
        const {data,error} = await supabase
        .from('bills')
        .select('*')
        .eq('billed_user',user_id)
        .eq('from',biller_name)
        .neq('status','paid')
        .neq('status','pending');
        if (error){
            throw error;
        } 
        return data;
    },
      
    updateBillStatus: async (bill:Partial<Bill>,status:string):Promise<void>=>{
        const invoice_number = bill.invoice_number;
        const supabase = createClient();
        const {data,error} = await supabase
        .from('bills')
        .update({status})
        .eq('invoice_number',invoice_number);
        if (error){
            throw error;
        }
    },
    updateBillAmount: async (bill:Partial<Bill>,amount:number):Promise<void>=>{
        const invoice_number = bill.invoice_number;
        const supabase = createClient();
        const {data,error} = await supabase
        .from('bills')
        .update({amount})
        .eq('invoice_number',invoice_number);
        if (error){
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

    deleteAdminBill: async (billId: string): Promise<void> => {
        const supabase = createClient();
    
        const { error } = await supabase
          .from('admin_bills')
          .delete()
          .eq('id', billId);
    
        if (error) {
          throw new Error(`Failed to delete bill: ${error.message}`);
        }
    
        console.log(`Bill with ID ${billId} deleted successfully`);
      },

    createBillForUsers: async (user_ids: string[], biller: Biller, amount: number, description: string,  dueDate: Date, linkedBill: string): Promise<void> => {
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
            await inboxAction.createMessage(biller.name, user_id, messageDescription, 'bill', invoiceNumber);
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
};
