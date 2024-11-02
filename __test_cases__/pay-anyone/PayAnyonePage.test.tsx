import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import PayAnyone from '@/app/(protected)/pay-anyone/page';
import { accountAction } from '@/lib/actions/accountAction';
import { useAppSelector } from '@/store/hooks';
import '@testing-library/jest-dom';

// Mock the accountAction module
jest.mock('@/lib/actions/accountAction', () => ({
  accountAction: {
    fetchAccountsbyUserId: jest.fn(),
  },
}));

// Mock the useAppSelector hook
jest.mock('@/store/hooks', () => ({
  useAppSelector: jest.fn(),
}));

// Mock child components
jest.mock('@/components/HeaderBox', () => () => <div>HeaderBox Component</div>);
jest.mock('@/components/PayAnyoneForm', () => ({ accounts }: { accounts: Account[] }) => (
  <div>PayAnyoneForm Component - Accounts: {accounts.length}</div>
));

enum AccountType {
  SAVINGS = 'savings',
  PERSONAL = 'personal',
  CREDIT = 'credit',
  DEBIT = 'debit',
  OTHER = 'other',
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

describe('PayAnyone Component', () => {
  const user_id = 'user123';

  const accounts: Account[] = [
    {
      id: '1',
      type: AccountType.PERSONAL,
      balance: 1000,
      owner: 'John Doe',
      bsb: '123456',
      acc: '789012345',
      opening_balance: 1000,
      owner_username: 'johndoe',
    },
    {
      id: '2',
      type: AccountType.SAVINGS,
      balance: 2000,
      owner: 'John Doe',
      bsb: '654321',
      acc: '543210987',
      opening_balance: 2000,
      owner_username: 'johndoe',
    },
  ];

  beforeEach(() => {
    jest.resetAllMocks();
    // Mock useAppSelector to return user_id
    (useAppSelector as jest.Mock).mockReturnValue(user_id);
  });

  it('should render without crashing', () => {
    // Mock fetchAccountsbyUserId to resolve immediately
    (accountAction.fetchAccountsbyUserId as jest.Mock).mockResolvedValue([]);

    render(<PayAnyone />);

    // Check if HeaderBox is rendered
    expect(screen.getByText('HeaderBox Component')).toBeInTheDocument();
  });

  it('should display loading message while fetching accounts', async () => {
    // Mock fetchAccountsbyUserId to resolve after a delay
    (accountAction.fetchAccountsbyUserId as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(accounts), 100))
    );

    render(<PayAnyone />);

    // Wait for accounts to be fetched
    await waitFor(() => {
      expect(accountAction.fetchAccountsbyUserId).toHaveBeenCalledWith(user_id);
    });
  });

  it('should display error message when fetching accounts fails', async () => {
    // Mock fetchAccountsbyUserId to reject
    (accountAction.fetchAccountsbyUserId as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(<PayAnyone />);

    // Wait for the error message to appear
    expect(await screen.findByText('Unable to fetch accounts')).toBeInTheDocument();
  });

  it('should filter out savings accounts and pass others to PayAnyoneForm', async () => {
    // Mock fetchAccountsbyUserId to resolve with accounts
    (accountAction.fetchAccountsbyUserId as jest.Mock).mockResolvedValue(accounts);

    render(<PayAnyone />);

    // Wait for PayAnyoneForm to be rendered
    expect(await screen.findByText(/PayAnyoneForm Component/i)).toBeInTheDocument();

    // Verify that PayAnyoneForm received the correct number of accounts (excluding savings)
    expect(screen.getByText('PayAnyoneForm Component - Accounts: 1')).toBeInTheDocument();
  });

  it('should handle case when user_id is not available', () => {
    // Mock useAppSelector to return undefined
    (useAppSelector as jest.Mock).mockReturnValue(undefined);

    render(<PayAnyone />);

    // Since user_id is undefined, fetchAccountsbyUserId should not be called
    expect(accountAction.fetchAccountsbyUserId).not.toHaveBeenCalled();
  });
  

  it('should render PayAnyoneForm when accounts are successfully fetched', async () => {
    // Mock fetchAccountsbyUserId to resolve with accounts
    (accountAction.fetchAccountsbyUserId as jest.Mock).mockResolvedValue(accounts);

    render(<PayAnyone />);

    // Wait for PayAnyoneForm to be rendered
    expect(await screen.findByText(/PayAnyoneForm Component/i)).toBeInTheDocument();

    // Verify that PayAnyoneForm received the correct number of accounts (excluding savings)
    expect(screen.getByText('PayAnyoneForm Component - Accounts: 1')).toBeInTheDocument();
  });
});
