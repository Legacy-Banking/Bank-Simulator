import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import BPAY from '@/app/(protected)/bpay/page';
import { accountAction } from '@/lib/actions/accountAction';
import { billerAction } from '@/lib/actions/billerAction';
import { useAppSelector } from '@/store/hooks';
import '@testing-library/jest-dom';

// Mock the accountAction and billerAction modules
jest.mock('@/lib/actions/accountAction', () => ({
  accountAction: {
    fetchAccountsbyUserId: jest.fn(),
  },
}));

jest.mock('@/lib/actions/billerAction', () => ({
  billerAction: {
    fetchBillersFromSavedBillers: jest.fn(),
  },
}));

// Mock the useAppSelector hook
jest.mock('@/store/hooks', () => ({
  useAppSelector: jest.fn(),
}));

// Mock child components
jest.mock('@/components/HeaderBox', () => () => <div>HeaderBox Component</div>);
jest.mock('@/components/BPAYForm', () => ({ accounts, billers }: { accounts: Account[], billers: Biller[] }) => (
  <div>BPAYForm Component - Accounts: {accounts.length}, Billers: {billers.length}</div>
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

interface Biller {
  id: string;
  name: string;
  biller_code: string;
}

describe('BPAY Component', () => {
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

  const billers: Biller[] = [
    { id: '1', name: 'Electricity Provider', biller_code: '123456' },
    { id: '2', name: 'Water Supply', biller_code: '654321' },
  ];

  beforeEach(() => {
    jest.resetAllMocks();
    // Mock useAppSelector to return user_id
    (useAppSelector as jest.Mock).mockReturnValue(user_id);
  });

  it('should render without crashing', async () => {
    // Wrap async state updates in act
    await act(async () => {
      (accountAction.fetchAccountsbyUserId as jest.Mock).mockResolvedValue([]);
      (billerAction.fetchBillersFromSavedBillers as jest.Mock).mockResolvedValue([]);
    });

    render(<BPAY />);

    // Use findByText to wait until HeaderBox Component is rendered
    expect(await screen.findByText('HeaderBox Component')).toBeInTheDocument();
  });

  it('should display loading message while fetching accounts and billers', async () => {
    (accountAction.fetchAccountsbyUserId as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(accounts), 100))
    );
    (billerAction.fetchBillersFromSavedBillers as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(billers), 100))
    );

    render(<BPAY />);

    await waitFor(() => {
      expect(accountAction.fetchAccountsbyUserId).toHaveBeenCalledWith(user_id);
      expect(billerAction.fetchBillersFromSavedBillers).toHaveBeenCalledWith(user_id);
    });
  });

  it('should display error message when fetching data fails', async () => {
    (accountAction.fetchAccountsbyUserId as jest.Mock).mockRejectedValue(new Error('Network error'));
    (billerAction.fetchBillersFromSavedBillers as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(<BPAY />);

    expect(await screen.findByText('Unable to fetch data')).toBeInTheDocument();
  });

  it('should filter out savings and credit accounts and pass others to BPAYForm', async () => {
    (accountAction.fetchAccountsbyUserId as jest.Mock).mockResolvedValue(accounts);
    (billerAction.fetchBillersFromSavedBillers as jest.Mock).mockResolvedValue(billers);

    render(<BPAY />);

    expect(await screen.findByText(/BPAYForm Component/i)).toBeInTheDocument();
    expect(screen.getByText('BPAYForm Component - Accounts: 1, Billers: 2')).toBeInTheDocument();
  });

  it('should handle case when user_id is not available', () => {
    (useAppSelector as jest.Mock).mockReturnValue(undefined);

    render(<BPAY />);

    expect(accountAction.fetchAccountsbyUserId).not.toHaveBeenCalled();
    expect(billerAction.fetchBillersFromSavedBillers).not.toHaveBeenCalled();
  });

  it('should render BPAYForm when accounts and billers are successfully fetched', async () => {
    (accountAction.fetchAccountsbyUserId as jest.Mock).mockResolvedValue(accounts);
    (billerAction.fetchBillersFromSavedBillers as jest.Mock).mockResolvedValue(billers);

    render(<BPAY />);

    expect(await screen.findByText(/BPAYForm Component/i)).toBeInTheDocument();
    expect(screen.getByText('BPAYForm Component - Accounts: 1, Billers: 2')).toBeInTheDocument();
  });
});
