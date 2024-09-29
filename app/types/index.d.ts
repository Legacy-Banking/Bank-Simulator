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
  bsb: string | null;
  acc: string | null;
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
  transaction_type: string;
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
  created_at: Date;
  due_date: Date
  status: string;
  invoice_number: string;
  reference_number: string;
  linked_bill: string;

  invoice_date: string;
  billed_to: string;
  total: string;
  tax: string;
}

declare interface AdminBill {
  id: string;
  created_at: Date;
  biller: string;
  description: string;
  amount: number;
  due_date: Date;
}

interface AdminBillWithBiller extends AdminBill {
  biller: Biller;
}

declare interface BillDetails {
  bill: Partial<Bill>;
  biller: Partial<Biller>;
}
declare interface Biller {
  id: string;
  name: string;
  biller_code: string;
  biller_details: string;

}
declare interface SavedBiller {
  id: string;
  saved_billers: string;
  owner: string;
  biller_reference: string;
}

declare interface User {
  user_id: string;
}

declare interface Message {
  id: string;
  description: string;
  date_received: Date;
  sender_name: string;
  to_user: string;
  read: boolean;
  type: string;
  bill_id: string;
}

declare interface Card {
  id: string;
  card_type: AccountType;
  credit: number;
  owner: string;
  card_number: string;
  expiry_date: Date;
  cvv: string;
  owner_username: string;
  linked_to: string;
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
  setShowUpdatePopUp: React.Dispatch<React.SetStateAction<boolean>>;
  setShowDeletePopUp: React.Dispatch<React.SetStateAction<boolean>>;
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
