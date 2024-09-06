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
  }
  declare interface Transaction {
    id: string;
    description: string;
    amount: number;
    paid_on: Date;
    from_account: string;
    to_account: string;
}
  declare interface Bill {
    id: string;
    billed_user: string;
    from: string;
    description: string;
    amount: number;
    paid_on: Date;
    status: string;
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

  type TransactionTableProps = {
    transactions: Transaction[];
  };
  
  type BillProps = {
    bills: Bill[]
  }
  
  declare type Category = "Food and Drink" | "Travel" | "Transfer";


  declare interface BankDropdownProps {
    accounts: Account[];
    setValue?: UseFormSetValue<any>;
    otherStyles?: string;
  }

  