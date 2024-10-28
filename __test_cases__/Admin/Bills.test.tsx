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



  // test('renders the bill details section', () => {
  //     const billDetailsSection = screen.getByTestId('bill-details-section');
      
  //     // Scope the search for "Electricity Provider" within the bill details section
  //     const providerName = within(billDetailsSection).getByText(/Electricity Provider/i);
  //     expect(providerName).toBeInTheDocument();
  // });


  test('renders the assigned users table', () => {
    const assignedUsersTable = screen.getByTestId('assigned-users-table');
    expect(assignedUsersTable).toBeInTheDocument();
  });

  test('renders assigned user rows', async () => {
    // Explicitly cast `fetchAssignedUsersStatus` to `jest.Mock`
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


  
  // test('calls onClose when close button is clicked', () => {
  //   const handleClose = jest.fn();
  //   const bill = {
  //     id: '1',
  //     created_at: new Date('2023-01-01'),
  //     due_date: new Date('2023-05-05'),
  //     description: 'Monthly electricity bill',
  //     amount: 200,
  //     assigned_users: 'user1, user2',
  //     preset_status: true,
  //     biller: {
  //       id: 'b1',
  //       biller_code: '12345',
  //       name: 'Electricity Provider',
  //       save_biller_status: true,
  //       reference_number: '987654321',
  //     },
  //   };

  //   render(<AdminBillSheet bill={bill} onClose={handleClose} onPresetStatusChange={jest.fn()} />);
  //   fireEvent.click(screen.getByText('Close'));
  //   expect(handleClose).toHaveBeenCalled();
  // });
        
// // Example for AdminBillsTable
// describe('AdminBillsTable', () => {
//   test('renders a list of bills', () => {
//     const bills = [
//       {
//         id: '1',
//         description: 'Bill 1',
//         amount: 100,
//         due_date: new Date(),
//         created_at: new Date(),
//         assigned_users: 'user1, user2',
//         preset_status: true,
//         biller: {
//           id: 'b1',
//           biller_code: '12345',
//           name: 'Electricity Provider',
//           save_biller_status: true,
//           reference_number: '987654321',
//         },
//       },
//       {
//         id: '2',
//         description: 'Bill 2',
//         amount: 150,
//         due_date: new Date(),
//         created_at: new Date(),
//         assigned_users: 'user3, user4',
//         preset_status: false,
//         biller: {
//           id: 'b2',
//           biller_code: '67890',
//           name: 'Water Provider',
//           save_biller_status: false,
//           reference_number: '123456789',
//         },
//       },
//     ];

//     render(<AdminBillsTable bills={bills} onUpdatePresetStatus={jest.fn()} onFetchUpdatedAssignedUsers={jest.fn()} onDeleteBill={jest.fn()} setDeleteBillId={jest.fn()} />);
//     expect(screen.getByText('Bill 1')).toBeInTheDocument();
//     expect(screen.getByText('Bill 2')).toBeInTheDocument();
//   });
// });

// describe('AssignUserSheet', () => {
//   test('renders user assignment sheet correctly with provided props', () => {
//     const biller = {
//       id: 'b1',
//       biller_code: '12345',
//       name: 'Electricity Provider',
//       save_biller_status: true,
//       reference_number: '987654321',
//     };

//     render(
//       <AssignUserSheet
//         isOpen={true}
//         onClose={jest.fn()}
//         biller={biller}
//         amount={200}
//         description="Monthly electricity bill"
//         due_date={new Date('2023-05-05')}
//         linkedBill="linkedBill123"
//         assignedUsers="user1, user2"
//         onAssignComplete={jest.fn()}
//       />
//     );

//     // Check for presence of essential information
//     expect(screen.getByText('Electricity Provider')).toBeInTheDocument();
//     expect(screen.getByText('Monthly electricity bill')).toBeInTheDocument();
//     expect(screen.getByText('Due Date:')).toBeInTheDocument();
//     expect(screen.getByText('Amount:')).toHaveTextContent('200');
//   });

//   test('calls onClose when close button is clicked', () => {
//     const handleClose = jest.fn();
//     const biller = {
//       id: 'b1',
//       biller_code: '12345',
//       name: 'Electricity Provider',
//       save_biller_status: true,
//       reference_number: '987654321',
//     };

//     render(
//       <AssignUserSheet
//         isOpen={true}
//         onClose={handleClose}
//         biller={biller}
//         amount={200}
//         description="Monthly electricity bill"
//         due_date={new Date('2023-05-05')}
//         linkedBill="linkedBill123"
//         assignedUsers="user1, user2"
//         onAssignComplete={jest.fn()}
//       />
//     );

//     fireEvent.click(screen.getByText('Close'));
//     expect(handleClose).toHaveBeenCalled();
//   });

//   test('triggers onAssignComplete callback when assignment is completed', async () => {
//     const handleAssignComplete = jest.fn().mockResolvedValue(jest.fn());
//     const biller = {
//       id: 'b1',
//       biller_code: '12345',
//       name: 'Electricity Provider',
//       save_biller_status: true,
//       reference_number: '987654321',
//     };

//     render(
//       <AssignUserSheet
//         isOpen={true}
//         onClose={jest.fn()}
//         biller={biller}
//         amount={200}
//         description="Monthly electricity bill"
//         due_date={new Date('2023-05-05')}
//         linkedBill="linkedBill123"
//         assignedUsers="user1, user2"
//         onAssignComplete={handleAssignComplete}
//       />
//     );

//     fireEvent.click(screen.getByText('Assign User'));
//     await waitFor(() => expect(handleAssignComplete).toHaveBeenCalledWith('linkedBill123'));
//   });
// });

// describe('CreateBillForm', () => {
//   test('renders form fields correctly', () => {
//     render(<CreateBillForm setIsCreatingBill={jest.fn()} fetchBills={jest.fn()} />);
//     expect(screen.getByLabelText('Bill Name')).toBeInTheDocument();
//     expect(screen.getByLabelText('Amount')).toBeInTheDocument();
//   });

//   test('displays error message for missing fields', async () => {
//     render(<CreateBillForm setIsCreatingBill={jest.fn()} fetchBills={jest.fn()} />);
//     fireEvent.click(screen.getByText('Submit'));
//     await waitFor(() => expect(screen.getByText('Please fill in all fields')).toBeInTheDocument());
//   });
// });

// describe('TrashBillDetailSheet', () => {
//   test('renders correctly with bill info', () => {
//     const bill = { id: '1', description: 'Test Bill' };
//     render(
//       <TrashBillDetailSheet
//         status={true}
//         bill={bill}
//         onClose={jest.fn()}
//         deleteBill={jest.fn()}
//       />
//     );
//     expect(screen.getByText('Delete Test Bill')).toBeInTheDocument();
//   });

//   test('deletes bill on confirm', () => {
//     const handleDelete = jest.fn();
//     const bill = { id: '1', description: 'Test Bill' };
//     render(
//       <TrashBillDetailSheet
//         status={true}
//         bill={bill}
//         onClose={jest.fn()}
//         deleteBill={handleDelete}
//       />
//     );
//     fireEvent.click(screen.getByText('Delete'));
//     expect(handleDelete).toHaveBeenCalled();
//   });
// });
