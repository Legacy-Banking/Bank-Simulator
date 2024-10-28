import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import Cards from '@/app/(protected)/cards/page';
import { cardAction } from '@/lib/actions/cardAction';
import { accountAction } from '@/lib/actions/accountAction';
import { useAppSelector } from '@/store/hooks';
import '@testing-library/jest-dom';

// Mock the cardAction and accountAction modules
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

// Mock the useAppSelector hook
jest.mock('@/store/hooks', () => ({
    useAppSelector: jest.fn(),
}));

// Mock child components
jest.mock('@/components/HeaderBox', () => () => <div>HeaderBox Component</div>);
jest.mock('@/components/DebitCard', () => ({ name }: { name: string }) => (
    <div>DebitCard Component - Name: {name}</div>
));
jest.mock('@/components/CreditCardModel', () => ({ name }: { name: string }) => (
    <div>CreditCardModel Component - Name: {name}</div>
));

describe('Cards Component', () => {
    const user_id = 'user123';

    const cards = [
        { id: '1', card_type: 'debit', owner_username: 'John Doe', card_number: '1234', expiry_date: '2025-12-31', cvv: '123' },
        { id: '2', card_type: 'credit', owner_username: 'Jane Doe', card_number: '5678', expiry_date: '2026-11-30', cvv: '456', credit: 5000 },
    ];

    const accounts = [
        { id: '1', balance: 1000, owner_username: 'John Doe' },
        { id: '2', balance: 500, owner_username: 'Jane Doe' },
    ];

    beforeEach(() => {
        jest.resetAllMocks();
        // Mock useAppSelector to return user_id
        (useAppSelector as jest.Mock).mockReturnValue(user_id);
    });

    it('renders without crashing', async () => {
        await act(async () => {
            (cardAction.fetchCardById as jest.Mock).mockResolvedValue([]);
            (accountAction.fetchAccountsbyUserId as jest.Mock).mockResolvedValue([]);
        });

        render(<Cards />);

        expect(await screen.findByText('HeaderBox Component')).toBeInTheDocument();
    });

    it('renders DebitCard and CreditCardModel components based on card type', async () => {
        (cardAction.fetchCardById as jest.Mock).mockResolvedValue(cards);
        (accountAction.fetchAccountsbyUserId as jest.Mock).mockResolvedValue(accounts);

        render(<Cards />);

        expect(await screen.findByText('DebitCard Component - Name: John Doe')).toBeInTheDocument();
        expect(await screen.findByText('CreditCardModel Component - Name: Jane Doe')).toBeInTheDocument();
    });

    it('handles case when user_id is not available', () => {
        (useAppSelector as jest.Mock).mockReturnValue(undefined);

        render(<Cards />);

        expect(cardAction.fetchCardById).not.toHaveBeenCalled();
        expect(accountAction.fetchAccountsbyUserId).not.toHaveBeenCalled();
    });
});
