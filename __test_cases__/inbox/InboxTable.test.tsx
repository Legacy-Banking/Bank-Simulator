import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import '@testing-library/jest-dom';
import { InboxTable } from '@/components/InboxTable';
import { inboxAction } from '@/lib/actions/inboxAction';

// Mock the InboxDetailSheet component to avoid router issues
jest.mock('@/components/InboxDetailSheet', () => () => (
  <div data-testid="mock-inbox-detail-sheet">Mocked InboxDetailSheet</div>
));

// Mock inboxAction to avoid calling real functions
jest.mock('@/lib/actions/inboxAction', () => ({
  inboxAction: {
    readMessage: jest.fn(), // Mocked readMessage function
  },
}));

const mockStore = configureStore([]);
const store = mockStore({});

const mockMessages = [
  {
    id: '1',
    type: 'bill',
    sender_name: 'Company A',
    description: 'Service Charge',
    date_received: new Date(),
    to_user: 'user_123',
    read: false,
    bill_id: '123',
    linked_bill: '1',
    linked_schedule: 'schedule_1',
  },
];

describe('InboxTable Component', () => {
  test('renders table rows with message details', () => {
    render(
      <Provider store={store}>
        <InboxTable messages={mockMessages} />
      </Provider>
    );

    // Verify the message details appear in the table
    expect(screen.getByText(/company a/i)).toBeInTheDocument();
    expect(screen.getByText(/service charge/i)).toBeInTheDocument();
  });

  test('marks message as read and opens details on row click', () => {
    render(
      <Provider store={store}>
        <InboxTable messages={mockMessages} />
      </Provider>
    );

    const messageRow = screen.getByText(/company a/i);
    fireEvent.click(messageRow);

    // Verify the readMessage function was called to mark the message as read
    expect(inboxAction.readMessage).toHaveBeenCalledWith(mockMessages[0]);

    // Verify that the mocked InboxDetailSheet component appears
    expect(screen.getByTestId('mock-inbox-detail-sheet')).toBeInTheDocument();
  });
});
