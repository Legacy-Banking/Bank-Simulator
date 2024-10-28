import React from 'react';
import { render, screen, fireEvent, waitFor, act, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminBillSheet from '@/components/AdminSide/Bills/AdminBillSheet';
import AdminBillsTable from '@/components/AdminSide/Bills/AdminBillsTable';
import AssignUserSheet from '@/components/AdminSide/Bills/AssignUserSheet';
import CreateBillForm from '@/components/AdminSide/Bills/CreateBillForm';
import TrashBillDetailSheet from '@/components/AdminSide/Bills/TrashBillDetailSheet';
import AdminDashboard from '@/app/admin/dashboard/page';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import AdminBillDetailSheet from '@/components/AdminSide/Bills/AdminBillSheet';
import { billAction } from '@/lib/actions/billAction';

// Mock props
const mockBill = {
  id: '1',
  created_at: new Date('2023-01-01'),
  due_date: new Date('2023-05-05'),
  description: 'Monthly electricity bill',
  amount: 200,
  assigned_users: 'user1, user2',
  preset_status: true,
  biller: {
    id: 'b1',
    biller_code: '12345',
    name: 'Electricity Provider',
    save_biller_status: true,
    reference_number: '987654321',
  },
};
jest.mock('@/lib/actions/billAction', () => ({
  billAction: {
      fetchAssignedUsersStatus: jest.fn().mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve([]), 1000))),
      updatePresetStatus: jest.fn(),
  }
}));


const mockOnClose = jest.fn();
const mockOnPresetStatusChange = jest.fn();

describe('AdminBillDetailSheet', () => {
  beforeEach(async () => {
    await act(async () => {
        render(
            <Provider store={store}>
                <AdminBillDetailSheet
                    bill={mockBill}
                    onClose={mockOnClose}
                    onPresetStatusChange={mockOnPresetStatusChange}
                />
            </Provider>
        );
    });
});
  afterEach(() => {
    jest.clearAllMocks();
  });
    
  test('renders the main dialog container', () => {
    const dialog = screen.getByTestId('admin-bill-details-dialog');
    expect(dialog).toBeInTheDocument();
  });
  
  test('renders the dialog title', () => {
    const title = screen.getByTestId('dialog-title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Admin Bill Details');
  });
  
  test('renders the dialog description', () => {
    const description = screen.getByTestId('dialog-description');
    expect(description).toBeInTheDocument();
    expect(description).toHaveTextContent('Detailed information about the selected bill.');
  });
  
  test('renders loading message when data is being fetched', async () => {
    (billAction.fetchAssignedUsersStatus as jest.Mock).mockImplementationOnce(() =>
        new Promise(resolve => setTimeout(() => resolve([]), 100))
    );

    expect(screen.getByTestId('loading-message')).toHaveTextContent('Loading assigned users...');

    await waitFor(() => {
        expect(screen.getByTestId('no-users-message')).toHaveTextContent('No users assigned.');
    });
});




  test('renders the preset status switch with correct initial state', () => {
    const switchElement = screen.getByTestId('preset-status-switch');
    expect(switchElement).toBeInTheDocument();
    expect(switchElement).toHaveAttribute('aria-checked', 'true');
  });

  test('toggles the preset status switch', async () => {
    const switchElement = screen.getByTestId('preset-status-switch');
    
    // First toggle
    await act(async () => {
        fireEvent.click(switchElement);
    });
    await waitFor(() => {
        expect(mockOnPresetStatusChange).toHaveBeenCalledWith(mockBill.id, false);
    });

    // Second toggle
    await act(async () => {
        fireEvent.click(switchElement);
    });
    await waitFor(() => {
        expect(mockOnPresetStatusChange).toHaveBeenCalledWith(mockBill.id, true);
    });
  });



  test('renders the bill details section with correct information', () => {
    const billDetailsSection = screen.getByTestId('bill-details-section');
    
    // Get all occurrences of "Electricity Provider" within the bill details section
    const providerElements = within(billDetailsSection).getAllByText(/Electricity Provider/i);

    // Check that there are two elements containing "Electricity Provider"
    expect(providerElements.length).toBe(2);

    // Check for other relevant bill information
    expect(within(billDetailsSection).getByText(/Monthly electricity bill/i)).toBeInTheDocument();
    expect(within(billDetailsSection).getByText(/200/i)).toBeInTheDocument();
    expect(within(billDetailsSection).getByText(/May 5, 2023/i)).toBeInTheDocument();

  });


  test('renders the assigned users table', () => {
    const assignedUsersTable = screen.getByTestId('assigned-users-table');
    expect(assignedUsersTable).toBeInTheDocument();
  });

  test('renders assigned user rows', async () => {

    (billAction.fetchAssignedUsersStatus as jest.Mock).mockResolvedValue([
        { name: 'user1', status: 'unpaid' },
        { name: 'user2', status: 'paid' }
    ]);

    const mockBillWithAssignedUsers = {
        ...mockBill,
    };

    render(
        <Provider store={store}>
            <AdminBillDetailSheet
                bill={mockBillWithAssignedUsers}
                onClose={mockOnClose}
                onPresetStatusChange={mockOnPresetStatusChange}
            />
        </Provider>
    );

    // Wait until assigned user rows are rendered
    await waitFor(() => {
        const userRows = screen.getAllByTestId('assigned-user-row');
        expect(userRows.length).toBe(2);
        expect(userRows[0]).toHaveTextContent('user1');
        expect(userRows[1]).toHaveTextContent('user2');
    });
  });




  test('renders "No users assigned" message when there are no assigned users', async () => {
    // Mock fetchAssignedUsersStatus to resolve with an empty array for this test only
    (billAction.fetchAssignedUsersStatus as jest.Mock).mockImplementationOnce(() => Promise.resolve([]));

    render(
        <Provider store={store}>
            <AdminBillDetailSheet
                bill={mockBill}
                onClose={mockOnClose}
                onPresetStatusChange={mockOnPresetStatusChange}
            />
        </Provider>
    );

    // Wait for "No users assigned" message to appear
    await waitFor(() => {
      expect(screen.getByTestId('no-users-message')).toHaveTextContent('No users assigned.');
    }); 
  });

  });

  
  test('calls onClose when close button is clicked', () => {
    const handleClose = jest.fn();

    render(
      <Provider store={store}>
        <AdminBillSheet bill={mockBill} onClose={handleClose} onPresetStatusChange={jest.fn()} />
      </Provider>
  );
    fireEvent.click(screen.getByText('Close'));
    expect(handleClose).toHaveBeenCalled();
});
        