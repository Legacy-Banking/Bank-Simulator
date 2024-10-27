import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BankDropdown } from '@/components/BankDropDown';
import '@testing-library/jest-dom';

enum AccountType {
  SAVINGS = 'savings',
  PERSONAL = 'personal',
  CREDIT = 'credit',
  DEBIT = 'debit',
  OTHER = 'other'
}

interface Account {
  id: string;
  type: AccountType;
  balance: number;
  owner: string;
  bsb: string | null;
  acc: string | null;
  opening_balance: number;
  owner_username: string;
}

describe('Transfer Funds Heading', () => {

const accounts: Account[] = [
    {
        id: '1',
        type: AccountType.PERSONAL,
        balance: 1000,
        owner: 'John Doe',
        bsb: '123-456',
        acc: '78901234',
        opening_balance: 1000,
        owner_username: 'johndoe'
    },
    {
        id: '2',
        type: AccountType.SAVINGS,
        balance: 2000,
        owner: 'Jane Smith',
        bsb: '234-567',
        acc: '89012345',
        opening_balance: 2000,
        owner_username: 'janesmith'
    },
    {
        id: '3',
        type: AccountType.CREDIT,
        balance: 500,
        owner: 'Sam Wilson',
        bsb: '345-678',
        acc: '90123456',
        opening_balance: 1000,
        owner_username: 'samwilson'
    },
    ];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        }).format(amount);
    };

  it('display the credit card logo with text Choose Account when nothing is selected', () => {

    render(<BankDropdown
      accounts={accounts}
      onChange={() => { }}
      label="From Bank Account"
      otherStyles="!w-full"
    />);

    // Check if "Choose Account" is displayed
    expect(screen.getByText(/Account/i)).toBeInTheDocument();

    // Check if the credit card logo is displayed
    const logo = screen.getByAltText('account');
    expect(logo).toBeInTheDocument();

  });

  it('should display the selected account type with its balance', () => {
    render(
      <BankDropdown
        accounts={accounts}
        onChange={() => {}}
        label="From Bank Account"
        initialSelected="1"
        otherStyles="!w-full"
      />
    );

    // Check if the selected account type and balance are displayed
    expect(screen.getByText(/personal - \$1,000.00/i)).toBeInTheDocument();
  });

  it('should display a list of selectable accounts with their balances when dropdown is triggered', async () => {
    // render(
    //     <BankDropdown
    //       accounts={accounts}
    //       onChange={() => {}}
    //       label="From Bank Account"
    //       otherStyles="!w-full"
    //     />
    //   );
    
    //   const user = userEvent.setup();
    
    //   // Open the dropdown
    //   const trigger = screen.getByRole('combobox');
    //   await user.click(trigger);
    
    //   // Check if accounts are displayed
    //   for (const account of accounts) {
    //     expect(await screen.findByText(account.type)).toBeInTheDocument();
    //     expect(
    //       screen.getByText(formatCurrency(account.balance))
    //     ).toBeInTheDocument();
    //   }
  });

  it('display balance of the selected account below the dropdown', () => { })


})