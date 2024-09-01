export enum AccountType {
    SAVINGS = 'savings',
    PERSONAL = 'personal',
    CREDIT = 'credit',
    DEBIT = 'debit',
    OTHER = 'other'
}


export interface Account {
    id: string;
    type: AccountType;
    balance: number;
    owner: string; 
    bsb: string;
    acc: string;
    opening_balance: number;
  }
  