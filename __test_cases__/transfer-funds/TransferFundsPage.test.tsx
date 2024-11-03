import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider, useDispatch } from 'react-redux';
import configureStore from 'redux-mock-store';
import TransferFunds from '@/app/(protected)/transfer-funds/page';
import '@testing-library/jest-dom';
import { accountAction } from '@/lib/actions/accountAction';
import { useAppSelector } from '@/store/hooks';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
  }));
  

// Mock the accountAction module
jest.mock('@/lib/actions/accountAction', () => ({
  accountAction: {
    fetchAccountsbyUserId: jest.fn(),
  },
}));

// Mock useAppSelector
jest.mock('@/store/hooks', () => ({
  useAppSelector: jest.fn(),
}));

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

describe('TransferFunds Page Component', () => {
  const accounts: Account[] = [
    {
      id: '1',
      type: AccountType.PERSONAL,
      balance: 1000,
      owner: 'John Doe',
      bsb: '123-456',
      acc: '78901234',
      opening_balance: 1000,
      owner_username: 'johndoe',
    },
    {
      id: '2',
      type: AccountType.SAVINGS,
      balance: 2000,
      owner: 'Jane Smith',
      bsb: '234-567',
      acc: '89012345',
      opening_balance: 2000,
      owner_username: 'janesmith',
    },
    {
      id: '3',
      type: AccountType.CREDIT,
      balance: 500,
      owner: 'Sam Wilson',
      bsb: '345-678',
      acc: '90123456',
      opening_balance: 1000,
      owner_username: 'samwilson',
    },
  ];

  const mockStore = jest.fn();
  const user_id = 'user123';
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock useAppSelector to return user_id
    (useAppSelector as jest.Mock).mockImplementation((selectorFn: Function) =>
      selectorFn({ user: { user_id } })
    );
    // Mock useRouter
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('should render without crashing', () => {
    // Mock fetchAccountsbyUserId to resolve with accounts data
    (accountAction.fetchAccountsbyUserId as jest.Mock).mockResolvedValueOnce(accounts);

    render(<TransferFunds />);

    // Check for the header
    expect(screen.getByRole('heading', { name: /Transfer Funds/i })).toBeInTheDocument();
  });

  it('should display loading message while fetching accounts', async () => {
    // Mock fetchAccountsbyUserId to resolve after a delay
    (accountAction.fetchAccountsbyUserId as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(accounts), 100))
    );

    render(<TransferFunds />);

    // Wait for accounts to be fetched
    await waitFor(() => {
      expect(accountAction.fetchAccountsbyUserId).toHaveBeenCalledWith(user_id);
    });
  });

  it('should display error message when fetching accounts fails', async () => {
    // Mock fetchAccountsbyUserId to reject
    (accountAction.fetchAccountsbyUserId as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<TransferFunds />);

    // Wait for error message to appear
    expect(await screen.findByText(/Unable to fetch accounts/i)).toBeInTheDocument();
  });

  it('should pass fetched accounts to TransferFundForm component', async () => {
    // Mock fetchAccountsbyUserId to resolve with accounts data
    (accountAction.fetchAccountsbyUserId as jest.Mock).mockResolvedValueOnce(accounts);

    render(<TransferFunds />);

    // Wait for accounts to be fetched and component to update
    await waitFor(() => {
      // Check if TransferFundForm is rendered with correct accounts
      expect(screen.getByText(/Please provide any specific details or notes related to the funds transfer/i)).toBeInTheDocument();
    });

    // Since TransferFundForm is a child component, you can check if its content is rendered
    // Check for multiple elements with "From Bank Account" text (label and select option)
    const fromBankAccountElements = screen.getAllByText(/From Bank Account/i);
    expect(fromBankAccountElements.length).toBe(2); // Expect two occurrences

  });

  it('should handle case when user_id is not available', () => {
    // Mock useAppSelector to return undefined for user_id
    (useAppSelector as jest.Mock).mockImplementation((selectorFn: Function) =>
      selectorFn({ user: { user_id: undefined } })
    );

    render(<TransferFunds />);

    // Since user_id is undefined, fetchAccountsbyUserId should not be called
    expect(accountAction.fetchAccountsbyUserId).not.toHaveBeenCalled();
  });
});
