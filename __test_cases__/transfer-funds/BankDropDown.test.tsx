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
    render(
        <BankDropdown
          accounts={accounts}
          onChange={() => {}}
          label="From Bank Account"
          otherStyles="!w-full"
        />
      );
    
      const user = userEvent.setup();
    
      // Open the dropdown
      const trigger = screen.getByRole('combobox');
      await user.click(trigger);
    
      // Check if accounts are displayed
      for (const account of accounts) {
        expect(await screen.findByText(account.type)).toBeInTheDocument();
        expect(
          screen.getByText(formatCurrency(account.balance))
        ).toBeInTheDocument();
      }
  });

  it('should call onChange with the selected account ID when an account is selected', async () => {
    const onChangeMock = jest.fn();
    render(
      <BankDropdown
        accounts={accounts}
        onChange={onChangeMock}
        label="From Bank Account"
        otherStyles="!w-full"
      />
    );

    const user = userEvent.setup();

    // Open the dropdown
    const trigger = screen.getByRole('combobox');
    await user.click(trigger);

    // Select the first account
    const firstAccountItem = await screen.findByText(accounts[0].type);
    await user.click(firstAccountItem);

    // Expect onChange to have been called with the account ID
    expect(onChangeMock).toHaveBeenCalledWith(accounts[0].id);
  });

  it('should display the balance of the selected account below the dropdown', () => {
    render(
      <BankDropdown
        accounts={accounts}
        onChange={() => {}}
        label="From Bank Account"
        initialSelected="2"
        otherStyles="!w-full"
      />
    );

    // Check if the balance is displayed below the dropdown
    expect(screen.getByText(/Balance: \$2,000.00/i)).toBeInTheDocument();
  });

  it('should display additionalOption when provided', async () => {
    const additionalOption = { id: '4', label: 'Use Card' };

    render(
      <BankDropdown
        accounts={accounts}
        onChange={() => {}}
        label="From Bank Account"
        otherStyles="!w-full"
        additionalOption={additionalOption}
      />
    );

    const user = userEvent.setup();

    // Open the dropdown
    const trigger = screen.getByRole('combobox');
    await user.click(trigger);

    // Check if additionalOption is displayed
    expect(await screen.findByText(additionalOption.label)).toBeInTheDocument();
  });

  it('should reset selected account when reset option is selected', async () => {
    const onChangeMock = jest.fn();
    render(
      <BankDropdown
        accounts={accounts}
        onChange={onChangeMock}
        label="From Bank Account"
        initialSelected="1"
        otherStyles="!w-full"
      />
    );

    const user = userEvent.setup();

    // Open the dropdown
    const trigger = screen.getByRole('combobox');
    await user.click(trigger);

    // Select the reset option
    const resetOption = await screen.findByText(/From Bank Account/i);
    await user.click(resetOption);

    // Expect onChange to have been called with "reset"
    expect(onChangeMock).toHaveBeenCalledWith('reset');

    // Check if "Choose Account" is displayed again
    expect(screen.getByText(/Choose Account/i)).toBeInTheDocument();

    // Check if balance below the dropdown is not displayed
    expect(screen.queryByText(/Balance:/i)).not.toBeInTheDocument();
  });

})