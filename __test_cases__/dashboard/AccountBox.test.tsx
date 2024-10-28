import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter as useRouterMock } from 'next/navigation';
import AccountBox from '@/components/AccountBox';
import '@testing-library/jest-dom';
import { Tooltip } from 'react-tooltip';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('react-tooltip', () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('AccountBox Component', () => {
  const mockPush = jest.fn();
  (useRouterMock as jest.Mock).mockReturnValue({ push: mockPush });

  const accountMock: Partial<Account> = {
    id: '123456789',
    type: 'personal' as AccountType,
    owner_username: 'JohnDoe',
    bsb: '123456',
    acc: '12345678',
    balance: 500,
    opening_balance: 1000,
  };

  test('renders account information correctly', async () => {
    render(<AccountBox account={accountMock} />);

    expect(screen.getByText('Personal Account')).toBeInTheDocument();
    expect(screen.getByText("JohnDoe's personal Account")).toBeInTheDocument();

    // Use waitFor with regular expressions to handle potential split text
    await waitFor(() => expect(screen.getByText(/BSB:\s*123-456/)).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText(/Account Number:\s*12-345-678/)).toBeInTheDocument());
  });

  test('navigates to transaction history on account link click', () => {
    render(<AccountBox account={accountMock} />);

    const accountLink = screen.getByText('Personal Account');
    fireEvent.click(accountLink);

    expect(mockPush).toHaveBeenCalledWith('/transaction-history?accountid=123456789');
  });

  test('displays tooltip text based on account type', async () => {
    const savingsAccountMock = { ...accountMock, type: 'savings' as AccountType };
    render(<AccountBox account={savingsAccountMock} />);
    await waitFor(() =>
      expect(screen.getByText(/Ideal for storing the majority of your funds/)).toBeInTheDocument()
    );

    const personalAccountMock = { ...accountMock, type: 'personal' as AccountType };
    render(<AccountBox account={personalAccountMock} />);
    await waitFor(() =>
      expect(screen.getByText(/The primary account for daily transactions/)).toBeInTheDocument()
    );

    const creditAccountMock = { ...accountMock, type: 'credit' as AccountType };
    render(<AccountBox account={creditAccountMock} />);
    await waitFor(() =>
      expect(screen.getByText(/To view credit available and used for credit card transactions/)).toBeInTheDocument()
    );
  });

  test('calculates credit used for credit accounts', async () => {
    const creditAccount = {
      ...accountMock,
      type: 'credit' as AccountType,
      balance: 400,
      opening_balance: 1000,
    };

    render(<AccountBox account={creditAccount} />);
    // Look for "Available Credit: $400" using a custom matcher
    await waitFor(() =>
      expect(screen.getByText((content, element) => {
        const hasText = (text: string) => content.includes(text);
        const elementHasCredit = hasText('Available Credit: $400');
        return elementHasCredit;
      })).toBeInTheDocument()
    );
  });
});
