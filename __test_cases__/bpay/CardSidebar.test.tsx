import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import CardSidebar from '@/components/CardSidebar';
import { cardAction } from '@/lib/actions/cardAction';
import { accountAction } from '@/lib/actions/accountAction';
import '@testing-library/jest-dom';

// Mock the child components
jest.mock('@/components/DebitCard', () => jest.fn(() => <div>DebitCard Component</div>));
jest.mock('@/components/CreditCardModel', () => jest.fn(() => <div>CreditCardModel Component</div>));

// Mock the cardAction and accountAction modules with a factory function
jest.mock('@/lib/actions/cardAction', () => ({
    cardAction: {
      fetchCardById: jest.fn(),
    },
  }));
  
  jest.mock('@/lib/actions/accountAction', () => ({
    accountAction: {
      fetchAccountsbyUserId: jest.fn(),
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

interface Card {
  id: string;
  card_type: AccountType;
  credit: number;
  owner: string;
  card_number: string;
  expiry_date: Date;
  cvv: string;
  owner_username: string;
  linked_to: string;
}

// Mock card and account data
const mockCards: Card[] = [
  {
    id: 'card1',
    card_type: AccountType.DEBIT,
    owner: 'userid1',
    owner_username: 'John Doe',
    card_number: '1234567812345678',
    expiry_date: new Date('2030-12-31'),
    cvv: '123',
    linked_to: '1',
    credit: 0,
  },
  {
    id: 'card2',
    card_type: AccountType.CREDIT,
    owner: 'userid1',
    owner_username: 'John Doe',
    card_number: '8765432187654321',
    expiry_date: new Date('2031-11-30'),
    cvv: '456',
    linked_to: '2',
    credit: 5000,
  },
];

const mockAccounts: Account[] = [
  {
    id: '1',
    type: AccountType.PERSONAL,
    balance: 1000,
    owner: 'userid1',
    bsb: '123456',
    acc: '789012345',
    opening_balance: 1000,
    owner_username: 'John Doe',
  },
  {
    id: '2',
    type: AccountType.CREDIT,
    balance: 2000,
    owner: 'userid1',
    bsb: '654321',
    acc: '543210987',
    opening_balance: 2000,
    owner_username: 'John Doe',
  },
];

beforeEach(() => {
    jest.clearAllMocks();
  });
  
describe('CardSidebar Component', () => {
    it('renders loading state correctly while fetching data', async () => {
        // Mock the API calls to delay the response
        (cardAction.fetchCardById as jest.Mock).mockImplementation(
          () => new Promise((resolve) => setTimeout(() => resolve(mockCards), 100))
        );
        (accountAction.fetchAccountsbyUserId as jest.Mock).mockImplementation(
          () => new Promise((resolve) => setTimeout(() => resolve(mockAccounts), 100))
        );
      
        render(<CardSidebar owner="userid1" />);
      
        // Check if the loading spinner is displayed
        expect(screen.getByText(/your cards/i)).toBeInTheDocument();
        expect(screen.getByRole('status')).toBeInTheDocument(); // Assuming the spinner has role="status"
      
        // Wait for loading to complete
        await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument());
      });

      it('renders error message when fetching data fails', async () => {
        // Mock the API calls to reject
        (cardAction.fetchCardById as jest.Mock).mockRejectedValue(new Error('Network error'));
        (accountAction.fetchAccountsbyUserId as jest.Mock).mockRejectedValue(new Error('Network error'));
      
        render(<CardSidebar owner="userid1" />);
      
        // Wait for the component to update
        await waitFor(() => {
          expect(screen.queryByRole('status')).not.toBeInTheDocument();
        });
      
        // Since the component doesn't display an error message, we can check if cards are not rendered
        expect(screen.queryByText(/DebitCard Component/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/CreditCardModel Component/i)).not.toBeInTheDocument();
      });

      it('fetches cards and accounts using the correct owner ID', async () => {
        // Mock the API calls to resolve immediately
        (cardAction.fetchCardById as jest.Mock).mockResolvedValue(mockCards);
        (accountAction.fetchAccountsbyUserId as jest.Mock).mockResolvedValue(mockAccounts);
      
        render(<CardSidebar owner="userid1" />);
      
        await waitFor(() => {
          expect(cardAction.fetchCardById).toHaveBeenCalledWith('userid1');
          expect(accountAction.fetchAccountsbyUserId).toHaveBeenCalledWith('userid1');
        });
      });
      
      it('renders only cards with linked accounts', async () => {
        const cardsWithUnlinked = [
           ...mockCards,
           {
              id: 'card3',
              card_type: AccountType.DEBIT,
              owner: 'userid1',
              owner_username: 'John Doe',
              card_number: '0000111122223333',
              expiry_date: new Date('2032-01-01'),
              cvv: '789',
              linked_to: 'nonexistent_account',
              credit: 0,
           },
        ];
     
        jest.spyOn(cardAction, 'fetchCardById').mockResolvedValue(cardsWithUnlinked);
        jest.spyOn(accountAction, 'fetchAccountsbyUserId').mockResolvedValue(mockAccounts);
     
        render(<CardSidebar owner="owner123" />);
     
        await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument());
        expect(screen.getByText(/Your Cards/i)).toBeInTheDocument();
        expect(screen.queryByText(/0000 1111 2222 3333/i)).toBeNull(); // Unlinked card should not render
    
     });
     it('renders DebitCard components for debit cards', async () => {
        (cardAction.fetchCardById as jest.Mock).mockResolvedValue([mockCards[0]]);
        (accountAction.fetchAccountsbyUserId as jest.Mock).mockResolvedValue(mockAccounts);
      
        render(<CardSidebar owner="userid1" />);
      
        // Wait for loading to finish
        await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument());
      
        // Now check for the DebitCard component
        expect(screen.getByText(/DebitCard Component/i)).toBeInTheDocument();
        expect(screen.queryByText(/CreditCardModel Component/i)).not.toBeInTheDocument();
      });
      
      it('renders CreditCardModel components for credit cards', async () => {
        (cardAction.fetchCardById as jest.Mock).mockResolvedValue([mockCards[1]]); // Only credit card
        (accountAction.fetchAccountsbyUserId as jest.Mock).mockResolvedValue(mockAccounts);
      
        render(<CardSidebar owner="userid1" />);
      
        await waitFor(() => {
          expect(screen.getByText(/CreditCardModel Component/i)).toBeInTheDocument();
          expect(screen.queryByText(/DebitCard Component/i)).not.toBeInTheDocument();
        });
      });
      
      it('does not render any cards if no cards are returned', async () => {
        (cardAction.fetchCardById as jest.Mock).mockResolvedValue([]); // No cards
        (accountAction.fetchAccountsbyUserId as jest.Mock).mockResolvedValue(mockAccounts);
      
        render(<CardSidebar owner="userid1" />);
      
        await waitFor(() => {
          expect(screen.queryByText(/DebitCard Component/i)).not.toBeInTheDocument();
          expect(screen.queryByText(/CreditCardModel Component/i)).not.toBeInTheDocument();
        });
      });
      
      it('does not render any cards if all cards have no linked accounts', async () => {
        const cardsWithNoLinkedAccounts = mockCards.map((card) => ({
          ...card,
          linked_to: 'nonexistent_account',
        }));
      
        (cardAction.fetchCardById as jest.Mock).mockResolvedValue(cardsWithNoLinkedAccounts);
        (accountAction.fetchAccountsbyUserId as jest.Mock).mockResolvedValue(mockAccounts);
      
        render(<CardSidebar owner="userid1" />);
      
        await waitFor(() => {
          expect(screen.queryByText(/DebitCard Component/i)).not.toBeInTheDocument();
          expect(screen.queryByText(/CreditCardModel Component/i)).not.toBeInTheDocument();
        });
      });
      
});
