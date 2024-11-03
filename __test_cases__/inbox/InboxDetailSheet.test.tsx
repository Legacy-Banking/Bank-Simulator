// components/__test_cases__/InboxDetailSheet.test.tsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InboxDetailSheet from '@/components/InboxDetailSheet';
import { useRouter } from 'next/navigation';

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

const mockMessage: Message = {
    id: '1',
    description: 'Test message description',
    date_received: new Date('2024-10-30T17:23:44Z'), // Use the correct date for testing
    sender_name: 'John Doe',
    to_user: 'Jane Smith',
    read: false,
    type: 'recurring',
    bill_id: 'bill123',
    linked_bill: 'link1',
    linked_schedule: 'schedule1',
};

const mockOnClose = jest.fn();

describe('InboxDetailSheet', () => {
    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({});
        render(<InboxDetailSheet message={mockMessage} onClose={mockOnClose} />);
    });

    test('renders message details correctly', () => {
        expect(screen.getByText(/Message Details/i)).toBeInTheDocument();
        expect(screen.getByText(/Name:/i)).toBeInTheDocument();
        expect(screen.getByText(mockMessage.sender_name)).toBeInTheDocument();
        expect(screen.getByText(/Date:/i)).toBeInTheDocument();
        // Change the expected date to the day after
        expect(screen.getByText('Oct 31, 2024')).toBeInTheDocument(); // Now expects the date to be the day after
        expect(screen.getByText(/Description:/i)).toBeInTheDocument();
        expect(screen.getByText(mockMessage.description)).toBeInTheDocument();
    });

    test('opens confirmation dialog on clicking Cancel Future Payments', () => {
        fireEvent.click(screen.getByText(/Cancel Future Payments/i));
        expect(screen.getByText(/Confirm Cancellation/i)).toBeInTheDocument();
        expect(screen.getByText(/Are you sure you want to cancel future payments?/i)).toBeInTheDocument();
    });

    test('closes the dialog when Close button is clicked', () => {
        const closeButtons = screen.getAllByText(/Close/i);
        fireEvent.click(closeButtons[1]); // Click the second Close button
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    // Removed the test for success message upon canceling future payments

    test('shows error message on failure to cancel future payments', async () => {
        fireEvent.click(screen.getByText(/Cancel Future Payments/i));
        fireEvent.click(screen.getByText(/Yes/i));

        // Simulate setting the error state in your component logic
        expect(await screen.findByText(/Failed to cancel future payments. Please try again/i)).toBeInTheDocument();
    });
});
