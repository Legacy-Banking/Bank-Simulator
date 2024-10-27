import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TransferFundsForm from '@/components/TransferFundsForm';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import { transactionAction } from '@/lib/actions/transactionAction';

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the transactionAction module
jest.mock('@/lib/actions/transactionAction', () => ({
  transactionAction: {
    createTransaction: jest.fn(),
  },
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

describe('TransferFundsForm Component', () => {
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

  const mockPush = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    // Mock useRouter
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it('should render all form fields correctly', () => {
    render(<TransferFundsForm accounts={accounts} />);

    // Check if all labels are rendered
    expect(screen.getAllByText(/From Bank Account/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/To Bank Account/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Amount/i)).toBeInTheDocument();
    expect(screen.getByText(/Description \(Optional\)/i)).toBeInTheDocument()

    // Check if submit button is rendered
    expect(screen.getByRole('button', { name: /Transfer Funds/i })).toBeInTheDocument();
  });

  it('should display validation errors when required fields are empty', async () => {
    render(<TransferFundsForm accounts={accounts} />);

    const user = userEvent.setup();

    // Click on submit button without filling the form
    const submitButton = screen.getByRole('button', { name: /Transfer Funds/i });
    await user.click(submitButton);

    // Check for validation errors
    const validationMessages = await screen.findAllByText(/Please select a valid bank account/i);
    expect(validationMessages).toHaveLength(2); // Ensure both validation errors are shown
    expect(screen.getByText(/Amount is required/i)).toBeInTheDocument();
  });

  it('should display error when transferring between the same account', async () => {
    render(<TransferFundsForm accounts={accounts} />);

    const user = userEvent.setup();

    // Select the same account for fromBank and toBank
    const fromBankTrigger = screen.getAllByRole('combobox')[0];
    await user.click(fromBankTrigger);
    await user.click(await screen.findByText(accounts[0].type));

    const toBankTrigger = screen.getAllByRole('combobox')[1];
    await user.click(toBankTrigger);
    await user.click(await screen.findByText(accounts[0].type));

    // Enter amount
    await user.type(screen.getByPlaceholderText(/ex: 100.00/i), '100');

    // Click on submit button
    const submitButton = screen.getByRole('button', { name: /Transfer Funds/i });
    await user.click(submitButton);

    // Check for error message
    expect(await screen.findByText(/You cannot transfer funds between the same account/i)).toBeInTheDocument();
  });

  it('should display error when amount is invalid', async () => {
    render(<TransferFundsForm accounts={accounts} />);

    const user = userEvent.setup();

    // Fill in valid fromBank and toBank
    const fromBankTrigger = screen.getAllByRole('combobox')[0];
    await user.click(fromBankTrigger);
    await user.click(await screen.findByText(accounts[0].type));

    const toBankTrigger = screen.getAllByRole('combobox')[1];
    await user.click(toBankTrigger);
    await user.click(await screen.findByText(accounts[1].type));

    // Enter invalid amount
    await user.type(screen.getByPlaceholderText(/ex: 100.00/i), 'abc');

    // Click on submit button
    const submitButton = screen.getByRole('button', { name: /Transfer Funds/i });
    await user.click(submitButton);

    // Check for validation error
    expect(await screen.findByText(/Please enter a valid amount/i)).toBeInTheDocument();
  });

  it('should call transactionAction.createTransaction on valid form submission', async () => {
    render(<TransferFundsForm accounts={accounts} />);

    const user = userEvent.setup();

    // Fill in valid fromBank and toBank
    const fromBankTrigger = screen.getAllByRole('combobox')[0];
    await user.click(fromBankTrigger);
    await user.click(await screen.findByText(accounts[0].type));

    const toBankTrigger = screen.getAllByRole('combobox')[1];
    await user.click(toBankTrigger);
    await user.click(await screen.findByText(accounts[1].type));

    // Enter valid amount
    await user.type(screen.getByPlaceholderText(/ex: 100.00/i), '100');

    // Enter description
    await user.type(screen.getByPlaceholderText(/Write a short description here/i), 'Test transfer');

    // Mock the createTransaction function to resolve
    (transactionAction.createTransaction as jest.Mock).mockResolvedValueOnce({});

    // Click on submit button
    const submitButton = screen.getByRole('button', { name: /Transfer Funds/i });
    await user.click(submitButton);

    // Wait for the form to be submitted
    await waitFor(() => {
      expect(transactionAction.createTransaction).toHaveBeenCalledWith(
        accounts[0],
        accounts[1],
        100,
        'Test transfer',
        'transfer funds'
      );
    });

    // Check if form is reset and redirected
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('should display error when transferring amount exceeds credit limit', async () => {
    render(<TransferFundsForm accounts={accounts} />);

    const user = userEvent.setup();

    // From bank is any account
    const fromBankTrigger = screen.getAllByRole('combobox')[0];
    await user.click(fromBankTrigger);
    await user.click(await screen.findByText(accounts[0].type));

    // To bank is credit account with id '3'
    const toBankTrigger = screen.getAllByRole('combobox')[1];
    await user.click(toBankTrigger);
    await user.click(await screen.findByText(accounts[2].type));

    // Enter amount exceeding credit limit
    await user.type(screen.getByPlaceholderText(/ex: 100.00/i), '600'); // Credit limit is 1000, current balance is 500

    // Click on submit button
    const submitButton = screen.getByRole('button', { name: /Transfer Funds/i });
    await user.click(submitButton);

    // Check for error message
    expect(await screen.findByText(/This transaction exceeds the credit limit/i)).toBeInTheDocument();
  });

  it('should display error message when transactionAction.createTransaction fails', async () => {
    render(<TransferFundsForm accounts={accounts} />);

    const user = userEvent.setup();

    // Fill in valid fromBank and toBank
    const fromBankTrigger = screen.getAllByRole('combobox')[0];
    await user.click(fromBankTrigger);
    await user.click(await screen.findByText(accounts[0].type));

    const toBankTrigger = screen.getAllByRole('combobox')[1];
    await user.click(toBankTrigger);
    await user.click(await screen.findByText(accounts[1].type));

    // Enter valid amount
    await user.type(screen.getByPlaceholderText(/ex: 100.00/i), '100');

    // Mock the createTransaction function to reject
    (transactionAction.createTransaction as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    // Click on submit button
    const submitButton = screen.getByRole('button', { name: /Transfer Funds/i });
    await user.click(submitButton);

    // Check for error message
    expect(await screen.findByText(/Network error/i)).toBeInTheDocument();
  });
});
