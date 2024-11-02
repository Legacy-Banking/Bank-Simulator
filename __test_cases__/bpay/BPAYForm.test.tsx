import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BPAYForm from '@/components/BPAYForm';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { bpayAction } from '@/lib/actions/bpayAction';
import { billerAction } from '@/lib/actions/billerAction';
import { scheduleAction } from '@/lib/actions/scheduleAction';
import { cardAction } from '@/lib/actions/cardAction';
import { billAction } from '@/lib/actions/billAction';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
  }));

jest.mock('@/store/hooks', () => ({
  useAppSelector: jest.fn(),
}));

jest.mock('@/lib/actions/bpayAction', () => ({
  bpayAction: {
    payBills: jest.fn(),
  },
}));

jest.mock('@/lib/actions/billerAction', () => ({
  billerAction: {
    fetchBillerById: jest.fn(),
    fetchReferenceNumberByBillerName: jest.fn(),
    fetchBillerByName: jest.fn(),
    addNewBiller: jest.fn(),
  },
}));

jest.mock('@/lib/actions/scheduleAction', () => ({
  scheduleAction: {
    setScheduleType: jest.fn(),
    setPayInterval: jest.fn(),
    setRecurRule: jest.fn(),
    setEndDate: jest.fn(),
    setRecurCount: jest.fn(),
    createScheduleEntry: jest.fn(),
  },
}));

jest.mock('@/lib/actions/cardAction', () => ({
    cardAction: {
      fetchCardAccountId: jest.fn(),
      fetchCardById: jest.fn(), 
    },
  }));
  

jest.mock('@/lib/actions/billAction', () => ({
  billAction: {
    fetchAssignedBills: jest.fn(),
  },
}));

jest.mock('@/components/CardSidebar', () => () => <div data-testid="mock-card-sidebar" />);

interface BillerAccount {
    id: string;
    name: string;
    biller_code: string;
  }

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

describe('BPAYForm Component', () => {
    const mockAccounts :  Account[] = [
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
      
    const mockBillers: BillerAccount[] = [
        { id: '1', name: 'Electricity Provider', biller_code: '123456' },
        { id: '2', name: 'Water Supply', biller_code: '654321' },
        { id: '3', name: 'Gas Company', biller_code: '789012' },
      ];
  
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock useRouter
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('renders BPAYForm component', () => {
        render(<BPAYForm accounts={mockAccounts} billers={mockBillers} />);
      
        // Check for key elements
        expect(screen.getByText(/Biller Details/i)).toBeInTheDocument();
        expect(screen.getAllByText(/Select Biller/i)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/From Bank Account/i)[0]).toBeInTheDocument();
        expect(screen.getByText(/^Amount$/i)).toBeInTheDocument();
      });

it('displays an error if no biller or manual biller details are provided', async () => {
    render(<BPAYForm accounts={mockAccounts} billers={mockBillers} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /Pay Bill/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/Please select a valid biller or fill in manual biller information/i)).toBeInTheDocument();
    });
  });

it('displays an error for invalid amount format', async () => {
    render(<BPAYForm accounts={mockAccounts} billers={mockBillers} />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText('ex: 100.00'), '100.123'); // More than 2 decimal places
    await user.click(screen.getByRole('button', { name: /Pay Bill/i }));

    await waitFor(() => {
        expect(screen.getByText(/Please enter a valid amount/i)).toBeInTheDocument();
    });
});
  
it('shows card details fields when "Use Card" is selected', async () => {
    render(<BPAYForm accounts={mockAccounts} billers={mockBillers} />);
    const user = userEvent.setup();

    // Open bank dropdown and select "Use Card" option
    await user.click(screen.getByText(/Choose Account/i));
    const useCardOption = screen.getAllByText(/Use Card/i)[1];
    await user.click(useCardOption);

    // Check that card details fields are displayed
    expect(screen.getByLabelText(/Card Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Expiry Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/CVV/i)).toBeInTheDocument();
});


it('displays error when account balance is insufficient', async () => {
    // Set a low balance on the selected account
    const lowBalanceAccount = { ...mockAccounts[0], balance: 50 };
    render(<BPAYForm accounts={[lowBalanceAccount]} billers={mockBillers} />);
    const user = userEvent.setup();

    // Select biller and account
    await user.click(screen.getByText('Choose Biller'));
    await user.click(screen.getByText('Electricity Provider'));
    await user.click(screen.getByText('Choose Account'));
    await user.click(screen.getByText('personal'));

    // Enter amount exceeding balance
    await user.type(screen.getByPlaceholderText('ex: 100.00'), '100.00');
    await user.click(screen.getByRole('button', { name: /Pay Bill/i }));

    // Assert that the insufficient funds error is shown
    await waitFor(() => {
      expect(screen.getByText(/Insufficient funds in selected account/i)).toBeInTheDocument();
    });
  });

  it('validates required fields for scheduled payments', async () => {
    render(<BPAYForm accounts={mockAccounts} billers={mockBillers} />);
    const user = userEvent.setup();

    // Select "schedule" payment option
    await user.click(screen.getByLabelText(/schedule/i));
    await user.click(screen.getByRole('button', { name: /Pay Bill/i }));

    // Check that the schedule date error is displayed
    await waitFor(() => {
      expect(screen.getByText(/Please select a date for scheduled payment/i)).toBeInTheDocument();
    });
  });

  it('validates required fields for recurring payments', async () => {
    render(<BPAYForm accounts={mockAccounts} billers={mockBillers} />);
    const user = userEvent.setup();
  
    // Select "recurring" payment option
    await user.click(screen.getByLabelText(/recurring/i));
    await user.click(screen.getByRole('button', { name: /Pay Bill/i }));
  
    // Check for the frequency error
    await screen.findByText(/select a frequency for recurring payment/i);
  
    // // Check for the end condition error separately
    // await screen.findByText(/select an end condition for recurring payment/i);
  });
  
  
});
    
  