// ViewBillsTable.test.tsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { ViewBillsTable } from '@/components/ViewBillsTable';
import { useRouter } from 'next/navigation';
import '@testing-library/jest-dom';

// Mock BillSheet to avoid rendering it within ViewBillsTable tests
jest.mock('@/components/BillsDetailSheet', () => () => (
  <div data-testid="mock-bill-sheet">Mocked BillSheet</div>
));

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

const mockStore = configureStore([]);
const store = mockStore({});

const mockBills = [
  {
    bill: {
      id: '1',
      invoice_number: 'INV001',
      created_at: new Date(),
      description: 'Service Charge',
      amount: 100,
      due_date: new Date(),
      from: 'Company A',
      status: 'Pending',
    },
    biller: {
      name: 'Company A',
      biller_code: '12345',
    },
  },
];

describe('ViewBillsTable Component', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
  });

  test('renders table rows with bill details', () => {
    render(
      <Provider store={store}>
        <ViewBillsTable bills={mockBills} />
      </Provider>
    );

    // Check if the bill details render correctly in the table
    expect(screen.getByText(/company a/i)).toBeInTheDocument();
    expect(screen.getByText(/\$100.00/i)).toBeInTheDocument();
    expect(screen.getByText(/pending/i)).toBeInTheDocument();
  });

  test('navigates and sets selected bill on row click', () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });

    render(
      <Provider store={store}>
        <ViewBillsTable bills={mockBills} />
      </Provider>
    );

    // Click on a table row to trigger navigation and set the selected bill
    const tableRow = screen.getByText(/company a/i);
    fireEvent.click(tableRow);

    // Verify that the push method was called with the correct route
    expect(pushMock).toHaveBeenCalledWith('/view-bills?invoice_id=INV001');
  });
});
