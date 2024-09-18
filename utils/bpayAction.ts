import { billAction } from "./billAction";
import { transactionAction } from "./transactionAction";
import { accountAction } from "./accountAction";

export const bpayAction = {
    payBills: async (
        user_id: string, 
        from_account: Account, 
        biller_name: string, 
        biller_code: string, 
        reference_number: string, 
        amount: number, 
        description: string, 
        bills: Partial<Bill>[]
    ): Promise<void> => {
        const account = await accountAction.fetchAccountById(from_account.id);
        console.log('account_balance', account.balance);
        console.log('amount', amount);
        await transactionAction.updateAccounts(account, account.balance - amount);


        try {
            
            let billcredit = amount;


            for (const bill of bills) {
                if (billcredit <= 0) break;

                // Ensure the bill amount is valid
                if (!bill.amount || bill.amount <= 0) {
                    console.error(`Invalid amount for bill: ${bill.id}`);
                    continue;
                }

                if (billcredit >= bill.amount) {
                    // Full payment
                    await transactionAction.createBPAYTransaction(
                        account, biller_name, biller_code, reference_number, bill.amount, description, null
                    );
                    await billAction.updateBillStatus(bill, 'paid');
                    billcredit -= bill.amount;
                } else {
                    // Partial payment
                    await transactionAction.createBPAYTransaction(
                        account, biller_name, biller_code, reference_number, billcredit, description, null
                    );
                    const newAmount = bill.amount - billcredit;
                    await billAction.updateBillStatus(bill, 'partial');
                    await billAction.updateBillAmount(bill, newAmount);
                    billcredit = 0;
                }
            }
        } catch (error) {
            console.error('Error processing BPAY payments:', error);
            throw new Error('BPAY payment processing failed.');
        }
    }
};
