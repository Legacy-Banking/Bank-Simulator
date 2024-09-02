export interface Transaction {
    id: string;
    description: string;
    amount: number;
    paid_on: Date;
    from_account: string;
    to_account: string;
}