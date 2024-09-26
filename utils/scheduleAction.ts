import { createClient } from "./supabase/client";
import { referenceNumberGenerator } from './accbsbGenerator';

enum ScheduleType {
    transfer = 'transfer',
    bpay = 'bpay',
    transfer_recur = 'transfer_recur',
    bpay_recur = 'bpay_recur'
}
enum PayInterval{
    weekly = 'weekly',
    fortnightly = 'fortnightly',
    monthly = 'monthly',
    quarterly = 'quarterly',
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
        this.scheduleType = ScheduleType.transfer; // default
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
            case 'transfer':
                this.scheduleType = ScheduleType.transfer;
                break;
            case 'bpay':
                this.scheduleType = ScheduleType.bpay;
                break;
            case 'transfer_recur':
                this.scheduleType = ScheduleType.transfer_recur;
                break;
            case 'bpay_recur':
                this.scheduleType = ScheduleType.bpay_recur;
                break;
            default:
                this.scheduleType = ScheduleType.transfer;
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
        if (this.scheduleType === ScheduleType.bpay || this.scheduleType === ScheduleType.bpay_recur) {
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
            recur_count: this.recur_count_dec
        }]);
        console.log(recur_error);


    }

    // // Fetch payments and execute them if necessary
    // public async checkAndExecuteScheduledPayments(userId: string): Promise<void> {
    //     const { data: scheduledPayments, error } = await this.supabase
    //         .from('schedule_payments')
    //         .select('*')
    //         .eq('related_user', userId)
    //         .lt('pay_at', new Date()); // Fetch payments that should have already been made

    //     if (error) {
    //         console.error('Error fetching scheduled payments:', error);
    //         return;
    //     }

    //     if (scheduledPayments) {
    //         for (const payment of scheduledPayments) {
    //             // Execute based on schedule type
    //             if (payment.schedule_type === ScheduleType.transfer || payment.schedule_type === ScheduleType.transfer_recur) {
    //                 await this.executeTransfer(payment);
    //             } else if (payment.schedule_type === ScheduleType.bpay || payment.schedule_type === ScheduleType.bpay_recur) {
    //                 await this.executeBpay(payment);
    //             }
    //         }
    //     }
    // }

    // public async executeScheduledPayment(user_id:string){
    //     const supabase = createClient();
    //     const { data: scheduledPayments, error } = await supabase.from('schedule_payments').select('*')
    //     scheduledPayments?.filter((payment) => {
    //         payment.related_user.includes(user_id)
    //         && payment.pay_at < new Date()
    //     }).forEach(async (payment) => {
    //         const schedule_type = payment.schedule_type;
    //         if (payment.schedule_type === ScheduleType.transfer || payment.schedule_type === ScheduleType.transfer_recur) {
    //             await this.executeTransfer(payment);
    //         } else if (payment.schedule_type === ScheduleType.bpay || payment.schedule_type === ScheduleType.bpay_recur) {
    //             await this.executeBpay(payment);
    //         }

    //     })
    // }
    // private async incrementRecurEntry(schedule_ref: string): Promise<boolean> {
    //     const {data:recur_payment, error} = await this.supabase.from('recurring_payments').select('*').eq('related_schedule', schedule_ref).single();
    //     const interval = recur_payment.interval;
    //     let nextPayment = new Date();
    //     switch(interval){
    //         case '1 week':
    //             nextPayment.setDate(nextPayment.getDate() + 7);
    //             break;
    //         case '2 weeks':
    //             nextPayment.setDate(nextPayment.getDate() + 14);
    //             break;
    //         case '1 month':
    //             nextPayment.setMonth(nextPayment.getMonth() + 1);
    //             break;
    //         case '3 months':
    //             nextPayment.setMonth(nextPayment.getMonth() + 3);
    //             break;
    //         default:
    //             nextPayment.setMonth(nextPayment.getMonth() + 1);
    //             break;
    //     }
    //     return false;


    // }

    // private async executeTransfer(payment: any): Promise<void> {
    //     console.log('Executing transfer:', payment);
    //     // Logic to execute the transfer
    // }

    // private async executeBpay(payment: any): Promise<void> {
    //     console.log('Executing BPAY:', payment);
    //     // Logic to execute the BPAY
    // }
}

export const scheduleAction = new ScheduleAction();
