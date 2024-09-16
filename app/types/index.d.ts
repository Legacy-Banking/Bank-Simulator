declare type SearchParamProps = {
    params: { [key: string]: string };
    searchParams: { [key: string]: string | string[] | undefined };
  };

  // ==============================


  declare type LoginUser = {
    userId: string;
    password: string;
  };

  declare type SignUpParams = {
    userId: string;
    email: string;
    password: string;
  };


  declare interface HeaderBoxProps {
    type?: "title" | "greeting";
    title: string;
    subtext: string;
    user?: string;
  }

  declare interface BalanceBoxProps {
    accounts: Account[];
    currentBalance: number;
  }

  declare interface BankInfoProps {
    account: Account;
    supabaseItemId?: string;
    type: "full" | "card";
  }
  
  declare enum AccountType {
    SAVINGS = 'savings',
    PERSONAL = 'personal',
    CREDIT = 'credit',
    DEBIT = 'debit',
    OTHER = 'other'
}


  declare interface Account {
    id: string;
    type: AccountType;
    balance: number;
    owner: string; 
    bsb: string;
    acc: string;
    opening_balance: number;
    owner_username: string;
  }
  declare interface Transaction {
    id: string;
    description: string;
    amount: number;
    paid_on: Date;
    from_account: string;
    from_account_username: string;
    to_account: string;
    to_biller: string;
    to_account_username: string;
}

  declare interface BPAYTransaction {
    id: string;
    description: string;
    amount: number;
    paid_on: Date;
    from_account: string;
    from_account_username: string;
    biller_name: string;
    biller_code: string;
    reference_number: string;
    card_number: string;
    expiry_date: string;
    cvv: string;
  }

  declare interface Bill {
    id: string;
    billed_user: string;
    from: string;
    description: string;
    amount: number;
    paid_on: Date;
    created_on: Date;
    due_date: Date
    status: string;
    invoice_number: string;
    reference_number: string;
  }
  declare interface BillDetails {
    bill:Partial<Bill>;
    biller:Partial<Biller>;
  }
  declare interface Biller{
    id: string;
    name: string;
    biller_code: string;
    biller_details: string;
  }
  declare interface SavedBiller{
    id: string;
    saved_billers: string;
    owner: string;
    biller_reference: string;
  }

  declare interface User{
    user_id: string;
  }

  declare interface Message {
    id: string;
    description: string;
    date_received: Date;
    from_account: string;
    to_account: string;
  }

  declare interface Card {
    id: string;
    card_type: AccountType;
    credit: number;
    owner: string; 
    card_number: string;
    expiry_date: string;
    cvv: string;
    owner_username: string
  }

  declare interface BillerAccount {
    id: string;
    name: string; 
    biller_code: string;
  }

  // declare type Transaction = {
  //   id: string;
  //   $id: string;
  //   name: string;
  //   paymentChannel: string;
  //   type: string;
  //   accountId: string;
  //   amount: number;
  //   pending: boolean;
  //   category: string;
  //   date: string;
  //   image: string;
  //   type: string;
  //   $createdAt: string;
  //   channel: string;
  //   senderBankId: string;
  //   receiverBankId: string;
  // };

  type AccountsTableProps = {
    accounts: Account[];
  }

  type TransactionTableProps = {
    transactions: Transaction[];
  };

  type InboxTableProps = {
    messages: Message[];
  };
  
  type BillProps = {
    bills: BillDetails[]
  }
  
  declare type Category = "Food and Drink" | "Travel" | "Transfer";


  declare interface BankDropdownProps {
    accounts: Account[];
    setValue?: UseFormSetValue<any>;
    otherStyles?: string;
  }

  declare interface PaginationProps {
    page: number;
    totalPages: number;
    setPage: (page: number) => void; // Function to update the page state
  }
  

  // declare interface PaymentWhenOptionsProps {
  //   showScheduleDate: boolean;
  // }
  