import { createClient } from "./supabase/client";
import { referenceNumberGenerator } from './accbsbGenerator';
import { bpayAction } from "./bpayAction";
import { transactionAction } from "./transactionAction";

enum ScheduleType {
    transfer_schedule = 'transfer_schedule',
    bpay_schedule = 'bpay_schedule',
    transfer_recur = 'transfer_recur',
    bpay_recur = 'bpay_recur'
}
enum PayInterval{
    weekly = 'weekly',
    fortnightly = 'fortnightly',
    monthly = 'monthly',
    quarterly = 'quarterly',
}

type Schedule= {
    pay_at: Date,
    related_user: string[],
    from_account: string,
    to_account: string | null,
    biller_name: string | null,
    biller_code: string | null,
    reference_number: string | null,
    amount: number,
    description: string,
    schedule_ref: string,
    schedule_type: ScheduleType,
    recurring: Recurring | null

}
type Recurring = {
    interval: string,
    related_schedule: string,
    recur_rule: string| null,
    end_date: Date| null,
    recur_count_dec: number| null,
}



class ScheduleAction {
    private supabase: any;
    private scheduleType: ScheduleType;
    private payInterval: PayInterval;
    private recur_rule: string;
    private end_date: Date;
    private recur_count_dec:number;

    constructor() {
        this.supabase = createClient();
        this.scheduleType = ScheduleType.transfer_schedule; // default
        this.payInterval = PayInterval.monthly; // default
        this.recur_rule = '';
        this.end_date = new Date();
        this.recur_count_dec = 0;
    }
    public setRecurRule(rule: string): void {
        this.recur_rule = rule;
    }
    public setEndDate(date: Date): void {
        this.end_date = date;
    }
    public setRecurCount(count: number): void {
        this.recur_count_dec = count;
    }

    // Setter to change the schedule type
    public setScheduleType(type: string): void {
        switch(type){
            case 'transfer_schedule':
                this.scheduleType = ScheduleType.transfer_schedule;
                break;
            case 'bpay_schedule':
                this.scheduleType = ScheduleType.bpay_schedule;
                break;
            case 'transfer_recur':
                this.scheduleType = ScheduleType.transfer_recur;
                break;
            case 'bpay_recur':
                this.scheduleType = ScheduleType.bpay_recur;
                break;
            default:
                this.scheduleType = ScheduleType.transfer_schedule;
                break;
        }
    }
    public setPayInterval(interval: string): void {
        switch(interval){
            case 'weekly':
                this.payInterval = PayInterval.weekly;
                break;
            case 'fortnightly':
                this.payInterval = PayInterval.fortnightly;
                break;
            case 'monthly':
                this.payInterval = PayInterval.monthly;
                break;
            case 'quarterly':
                this.payInterval = PayInterval.quarterly;
                break;
            default:
                this.payInterval = PayInterval.monthly;
                break;
        }
    }
    public parseFrequencyToInterval(frequency: string): string {
        switch (frequency) {
          case "weekly":
            return "1 week";
          case "fortnightly":
            return "2 weeks";
          case "monthly":
            return "1 month";
          case "quarterly":
            return "3 months";
          default:
            throw new Error(`Unsupported frequency: ${frequency}`);
        }
    }
    public parseInterval(interval: string): number {
        switch (interval) {
            case "1 week":
              return 604800000;
            case "2 weeks":
              return 1209600000;
            case "1 month":
              return 2628000000;
            case "3 months":
              return 7884000000;
            default:
              throw new Error(`Unsupported interval: ${interval}`);
          }
    }


    // Unified method to create a schedule entry
    public async createScheduleEntry(fromAccount: Account, toAccount: Account | null, biller_name: string | null, biller_code: string | null, reference_number: string | null, amount: number, description: string, schedule: Date, related_user: string[]): Promise<string> {
        const schedule_ref = referenceNumberGenerator();

        let payload: any = {
            pay_at: schedule,
            related_user: related_user,
            from_account: fromAccount.id,
            to_account: toAccount ? toAccount.id : null,
            amount: amount,
            description: description,
            schedule_ref: schedule_ref,
            schedule_type: this.scheduleType
        };

        // Modify payload based on the schedule type
        if (this.scheduleType === ScheduleType.bpay_schedule || this.scheduleType === ScheduleType.bpay_recur) {
            payload.biller_name = biller_name;
            payload.biller_code = biller_code;
            payload.reference_number = reference_number;
        }

        const { data, error } = await this.supabase.from('schedule_payments').insert([payload]);

        if (error) {
            console.error('Error creating schedule entry:', error);
        }

        // If the schedule type includes "recur", call attachRecurEntry
        if (this.scheduleType === ScheduleType.transfer_recur || this.scheduleType === ScheduleType.bpay_recur) {
            await this.attachRecurEntry(schedule_ref);
        }

        return schedule_ref;
    }


    private async attachRecurEntry(schedule_ref: string): Promise<void> {
        const { data:schedule_payment, error } = await this.supabase.from('schedule_payments').select('*').eq('schedule_ref', schedule_ref).single();
        const { data:recur_payment, error:recur_error } = await this.supabase.from('recurring_payments').insert([{
            interval: this.parseFrequencyToInterval(this.payInterval),
            related_schedule: schedule_payment.id,
            recur_rule: this.recur_rule,
            end_date: this.end_date,
            recur_count_dec: this.recur_count_dec
        }]).select('id').single(); 
        await this.supabase.from('schedule_payments').update({recurring_payment: recur_payment.id}).eq('id', schedule_payment.id);  
    }


    // Method to execute all schedules that are pending and have a pay_at date less than or equal to the current date
    // This method should be called at the start of each day, at a cron job or similar
    public async executeSchedules(): Promise<void> {
        const {data:schedulePayments,error}=await this.supabase.from('schedule_payments').select('*').lte('pay_at',new Date()).eq('status','pending');
        if(schedulePayments){
            for(const schedule of schedulePayments){
                await this.executeSchedule(schedule);
            }
        }
    }

    private async executeSchedule(schedule: any): Promise<void> {
        const schedule_type = schedule.schedule_type;
        switch (schedule_type) {
            case ScheduleType.transfer_schedule:
                await this.executeTransfer(schedule);
                break;
            case ScheduleType.bpay_schedule:
                await this.executeBpay(schedule);
                break;
            case ScheduleType.transfer_recur:
                await this.executeTransferRecur(schedule);
                break;
            case ScheduleType.bpay_recur:
                await this.executeBpayRecur(schedule);
                break;
            default:
                console.error('Unsupported schedule type:', schedule_type);
                break;
        }
    }
    private async executeTransfer(schedule: any): Promise<void> {
        const { data:fromAccount, error:fromAccountError } = await this.supabase.from('accounts').select('*').eq('id', schedule.from_account).single();
        const { data:toAccount, error:toAccountError } = await this.supabase.from('accounts').select('*').eq('id', schedule.to_account).single();
        if(fromAccount && toAccount){
            await transactionAction.createTransaction(fromAccount, toAccount, schedule.amount, schedule.description, schedule.schedule_ref);
            await this.supabase.from('schedule_payments').update({status: 'completed'}).eq('id', schedule.id);
        }
    }
    private async executeBpay(schedule: any): Promise<void> {
        const { data:biller, error:billerError } = await this.supabase.from('billers').select('*').eq('biller_code', schedule.biller_code).single();
        if(biller){
            await bpayAction.payBills(schedule.from_account,schedule.biller_name, schedule.biller_code, schedule.amount, schedule.description, schedule.schedule_ref, schedule.related_user[0]);
            await this.supabase.from('schedule_payments').update({status: 'completed'}).eq('id', schedule.id);
        }
    }
    private async executeTransferRecur(schedule: any): Promise<void> {
        await this.executeTransfer(schedule);
        await this.executeRecur(schedule);
    }

    private async executeBpayRecur(schedule: any): Promise<void> {
        await this.executeBpay(schedule);
        await this.executeRecur(schedule);
    }

    private async executeRecur(schedule: any): Promise<void> {
        const { data: recurringPayment, error: recurringPaymentError } = await this.supabase.from('recurring_payments').select('*').eq('id', schedule.recurring_payment).single();
        if (recurringPaymentError || !recurringPayment) {
            console.error('Error fetching recurring payment:', recurringPaymentError);
            return;
        }
    
        const { recur_rule, interval, end_date, recur_count_dec } = recurringPayment;
        const pay_at = new Date(schedule.pay_at);
        const next_pay_at = new Date(pay_at.getTime() + this.parseInterval(interval));
    
        let shouldCompleteSchedule = false;
    
        // Check recurrence rules before updating
        switch (recur_rule) {
            case 'untilFurtherNotice':
                break;
            case 'untilDate':
                if (next_pay_at > new Date(end_date)) {
                    shouldCompleteSchedule = true;
                }
                break;
            case 'forCount':
                if (recur_count_dec > 0) {
                    await this.supabase.from('recurring_payments').update({ recur_count_dec: recur_count_dec - 1 }).eq('id', schedule.recurring_payment);
                }
                if (recur_count_dec - 1 <= 0) {
                    shouldCompleteSchedule = true;
                }
                break;
        }
    
        // Update next pay_at or complete the schedule if needed
        if (shouldCompleteSchedule) {
            await this.supabase.from('schedule_payments').update({ status: 'completed' }).eq('id', schedule.id);
        } else {
            await this.supabase.from('schedule_payments').update({ pay_at: next_pay_at }).eq('id', schedule.id);
        }
    }
    

}

export const scheduleAction = new ScheduleAction();
