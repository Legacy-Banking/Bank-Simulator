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

interface Account {
  id: string;
  name: string;
  currentBalance: number;
}

  declare type Transaction = {
    id: string;
    $id: string;
    name: string;
    paymentChannel: string;
    type: string;
    accountId: string;
    amount: number;
    pending: boolean;
    category: string;
    date: string;
    image: string;
    type: string;
    $createdAt: string;
    channel: string;
    senderBankId: string;
    receiverBankId: string;
  };

  declare type Category = "Food and Drink" | "Travel" | "Transfer";


  declare interface BankDropdownProps {
    accounts: Account[];
    setValue?: UseFormSetValue<any>;
    otherStyles?: string;
  }

  