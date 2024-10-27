import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PayAnyoneForm from '@/components/PayAnyoneForm';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import { accountAction } from '@/lib/actions/accountAction';
import { transactionAction } from '@/lib/actions/transactionAction';

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the accountAction module
jest.mock('@/lib/actions/accountAction', () => ({
  accountAction: {
    fetchAccountByBSBAndAccountNumber: jest.fn(),
  },
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

describe('PayAnyoneForm Component', () => {
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
    // Add more accounts if necessary
  ];

  const recipientAccount: Account = {
    id: '2',
    type: AccountType.SAVINGS,
    balance: 2000,
    owner: 'Jane Smith',
    bsb: '654321',
    acc: '543210987',
    opening_balance: 2000,
    owner_username: 'janesmith',
  };

  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock useRouter
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('should render all form fields correctly', () => {
    render(<PayAnyoneForm accounts={accounts} />);

    // Check if all labels are rendered
    expect(screen.getAllByText(/From Bank Account/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Receiver's BSB/i)).toBeInTheDocument();
    expect(screen.getByText(/Receiver's Account Number/i)).toBeInTheDocument();
    expect(screen.getByText(/^Amount$/i)).toBeInTheDocument();
    expect(screen.getByText(/Description \(Optional\)/i)).toBeInTheDocument();

    // Check if submit button is rendered
    expect(screen.getByRole('button', { name: /^Pay$/i })).toBeInTheDocument();
  });

  it('should display validation errors when required fields are empty', async () => {
    render(<PayAnyoneForm accounts={accounts} />);
  
    const user = userEvent.setup();
  
    // Click on submit button without filling the form
    const submitButton = screen.getByRole('button', { name: /^Pay$/i });
    await user.click(submitButton);
  
    // Check for validation errors using regular expressions
    expect(screen.getByText(/BSB must be a 6-digit number/i)).toBeInTheDocument();
    expect(screen.getByText(/Account number must be a 9-digit number/i)).toBeInTheDocument();
    expect(screen.getByText(/Amount is required/i)).toBeInTheDocument();
  });  

  it('should display error when BSB or account number is invalid', async () => {
    render(<PayAnyoneForm accounts={accounts} />);

    const user = userEvent.setup();

    // Fill in invalid BSB and account number
    await user.type(screen.getByPlaceholderText(/Enter BSB/i), '123');
    await user.type(screen.getByPlaceholderText(/Enter account number/i), 'abc');

    // Click on submit button
    const submitButton = screen.getByRole('button', { name: /^Pay$/i });
    await user.click(submitButton);

    // Check for validation errors
    expect(await screen.findByText(/BSB must be a 6-digit number/i)).toBeInTheDocument();
    expect(screen.getByText(/Account number must be a 9-digit number/i)).toBeInTheDocument();
  });

  it('should display error when amount is invalid', async () => {
    render(<PayAnyoneForm accounts={accounts} />);

    const user = userEvent.setup();

    // Fill in valid BSB and account number
    await user.type(screen.getByPlaceholderText(/Enter BSB/i), '654321');
    await user.type(screen.getByPlaceholderText(/Enter account number/i), '543210987');

    // Enter invalid amount
    await user.type(screen.getByPlaceholderText(/ex: 100\.00/i), 'abc');

    // Click on submit button
    const submitButton = screen.getByRole('button', { name: /^Pay$/i });
    await user.click(submitButton);

    // Check for validation error
    expect(await screen.findByText(/Please enter a valid amount/i)).toBeInTheDocument();
  });

  it('should display error when insufficient funds', async () => {
    render(<PayAnyoneForm accounts={accounts} />);

    const user = userEvent.setup();

    // Select fromBank account
    const fromBankTrigger = screen.getByRole('combobox');
    await user.click(fromBankTrigger);
    await user.click(await screen.findByText(accounts[0].type));

    // Fill in valid BSB and account number
    await user.type(screen.getByPlaceholderText(/Enter BSB/i), recipientAccount.bsb!);
    await user.type(screen.getByPlaceholderText(/Enter account number/i), recipientAccount.acc!);

    // Enter amount greater than balance
    await user.type(screen.getByPlaceholderText(/ex: 100\.00/i), '1500');

    // Mock fetchAccountByBSBAndAccountNumber to resolve with recipient account
    (accountAction.fetchAccountByBSBAndAccountNumber as jest.Mock).mockResolvedValueOnce(recipientAccount);

    // Click on submit button
    const submitButton = screen.getByRole('button', { name: /^Pay$/i });
    await user.click(submitButton);

    // Check for error message
    expect(await screen.findByText(/Insufficient funds in selected account/i)).toBeInTheDocument();
  });

  it('should display error when recipient account not found', async () => {
    jest.resetAllMocks(); // Ensure mocks are reset
  
    render(<PayAnyoneForm accounts={accounts} />);
  
    const user = userEvent.setup();
  
    // Select fromBank account
    const fromBankTrigger = screen.getByRole('combobox');
    await user.click(fromBankTrigger);
    await user.click(await screen.findByText(accounts[0].type));
  
    // Fill in invalid BSB and account number (no matching account)
    await user.type(screen.getByPlaceholderText(/Enter BSB/i), '999999');
    await user.type(screen.getByPlaceholderText(/Enter account number/i), '999999999');
  
    // Enter valid amount
    await user.type(screen.getByPlaceholderText(/ex: 100\.00/i), '100');
  
    // Mock fetchAccountByBSBAndAccountNumber to resolve with null
    (accountAction.fetchAccountByBSBAndAccountNumber as jest.Mock).mockResolvedValueOnce(null);
  
    // Click on submit button
    const submitButton = screen.getByRole('button', { name: /^Pay$/i });
    await user.click(submitButton);
  
    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText(/Recipient account not found/i)).toBeInTheDocument();
    });
  });
  

  it('should display error when paying to own account', async () => {
    jest.resetAllMocks(); // Ensure mocks are reset
  
    render(<PayAnyoneForm accounts={accounts} />);
  
    const user = userEvent.setup();
  
    // Select fromBank account
    const fromBankTrigger = screen.getByRole('combobox');
    await user.click(fromBankTrigger);
    await user.click(await screen.findByText(accounts[0].type));
  
    // Fill in BSB and account number matching own account
    await user.type(screen.getByPlaceholderText(/Enter BSB/i), '123456');
    await user.type(screen.getByPlaceholderText(/Enter account number/i), '789012345');
  
    // Enter valid amount
    await user.type(screen.getByPlaceholderText(/ex: 100\.00/i), '100');
  
    // Mock fetchAccountByBSBAndAccountNumber to resolve with own account
    (accountAction.fetchAccountByBSBAndAccountNumber as jest.Mock).mockResolvedValueOnce(accounts[0]);
  
    // Spy on fetchAccountByBSBAndAccountNumber
    const fetchAccountSpy = jest.spyOn(accountAction, 'fetchAccountByBSBAndAccountNumber');
  
    // Click on submit button
    const submitButton = screen.getByRole('button', { name: /^Pay$/i });
    await user.click(submitButton);
  
    // Check if fetchAccountByBSBAndAccountNumber was called with correct arguments
    expect(fetchAccountSpy).toHaveBeenCalledWith('123456', '789012345');
  
    // Check for error message
    expect(await screen.findByText(/You cannot pay to your own account/i)).toBeInTheDocument();
  });

  it('should call transactionAction.createTransaction on valid form submission', async () => {
    render(<PayAnyoneForm accounts={accounts} />);

    const user = userEvent.setup();

    // Select fromBank account
    const fromBankTrigger = screen.getByRole('combobox');
    await user.click(fromBankTrigger);
    await user.click(await screen.findByText(accounts[0].type));

    // Fill in valid BSB and account number
    await user.type(screen.getByPlaceholderText(/Enter BSB/i), recipientAccount.bsb!);
    await user.type(screen.getByPlaceholderText(/Enter account number/i), recipientAccount.acc!);

    // Enter valid amount
    await user.type(screen.getByPlaceholderText(/ex: 100\.00/i), '100');

    // Enter description
    await user.type(screen.getByPlaceholderText(/Write a short description here/i), 'Test payment');

    // Mock fetchAccountByBSBAndAccountNumber to resolve with recipient account
    (accountAction.fetchAccountByBSBAndAccountNumber as jest.Mock).mockResolvedValueOnce(recipientAccount);

    // Mock createTransaction to resolve
    (transactionAction.createTransaction as jest.Mock).mockResolvedValueOnce({});

    // Click on submit button
    const submitButton = screen.getByRole('button', { name: /^Pay$/i });
    await user.click(submitButton);

    // Wait for the form to be submitted
    await waitFor(() => {
      expect(transactionAction.createTransaction).toHaveBeenCalledWith(
        accounts[0],
        recipientAccount,
        100,
        'Test payment',
        'pay anyone'
      );
    });

    // Check if form is reset and redirected
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('should display error message when transactionAction.createTransaction fails', async () => {
    render(<PayAnyoneForm accounts={accounts} />);

    const user = userEvent.setup();

    // Select fromBank account
    const fromBankTrigger = screen.getByRole('combobox');
    await user.click(fromBankTrigger);
    await user.click(await screen.findByText(accounts[0].type));

    // Fill in valid BSB and account number
    await user.type(screen.getByPlaceholderText(/Enter BSB/i), recipientAccount.bsb!);
    await user.type(screen.getByPlaceholderText(/Enter account number/i), recipientAccount.acc!);

    // Enter valid amount
    await user.type(screen.getByPlaceholderText(/ex: 100\.00/i), '100');

    // Mock fetchAccountByBSBAndAccountNumber to resolve with recipient account
    (accountAction.fetchAccountByBSBAndAccountNumber as jest.Mock).mockResolvedValueOnce(recipientAccount);

    // Mock createTransaction to reject
    (transactionAction.createTransaction as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    // Click on submit button
    const submitButton = screen.getByRole('button', { name: /^Pay$/i });
    await user.click(submitButton);

    // Check for error message
    expect(await screen.findByText(/Network error/i)).toBeInTheDocument();
  });
});
