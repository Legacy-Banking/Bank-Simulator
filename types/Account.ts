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
    user_id: string; // Foreign key to the User entity (UUID)
  }
  