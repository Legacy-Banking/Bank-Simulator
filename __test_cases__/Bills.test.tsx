import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminBillSheet from '@/components/AdminSide/Bills/AdminBillSheet';
import AdminBillsTable from '@/components/AdminSide/Bills/AdminBillsTable';
import AssignUserSheet from '@/components/AdminSide/Bills/AssignUserSheet';
import CreateBillForm from '@/components/AdminSide/Bills/CreateBillForm';
import TrashBillDetailSheet from '@/components/AdminSide/Bills/TrashBillDetailSheet';

// Example for AdminBillSheet
describe('AdminBillSheet', () => {
  test('renders bill details correctly', () => {
    const bill = {
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

    render(<AdminBillSheet bill={bill} onClose={jest.fn()} onPresetStatusChange={jest.fn()} />);
    
    expect(screen.getByText('Monthly electricity bill')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText('Electricity Provider')).toBeInTheDocument();
    expect(screen.getByText('Biller Code: 12345')).toBeInTheDocument();
    expect(screen.getByText('Reference Number: 987654321')).toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', () => {
    const handleClose = jest.fn();
    const bill = {
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

    render(<AdminBillSheet bill={bill} onClose={handleClose} onPresetStatusChange={jest.fn()} />);
    fireEvent.click(screen.getByText('Close'));
    expect(handleClose).toHaveBeenCalled();
  });
});

// Example for AdminBillsTable
describe('AdminBillsTable', () => {
  test('renders a list of bills', () => {
    const bills = [
      {
        id: '1',
        description: 'Bill 1',
        amount: 100,
        due_date: new Date(),
        created_at: new Date(),
        assigned_users: 'user1, user2',
        preset_status: true,
        biller: {
          id: 'b1',
          biller_code: '12345',
          name: 'Electricity Provider',
          save_biller_status: true,
          reference_number: '987654321',
        },
      },
      {
        id: '2',
        description: 'Bill 2',
        amount: 150,
        due_date: new Date(),
        created_at: new Date(),
        assigned_users: 'user3, user4',
        preset_status: false,
        biller: {
          id: 'b2',
          biller_code: '67890',
          name: 'Water Provider',
          save_biller_status: false,
          reference_number: '123456789',
        },
      },
    ];

    render(<AdminBillsTable bills={bills} onUpdatePresetStatus={jest.fn()} onFetchUpdatedAssignedUsers={jest.fn()} onDeleteBill={jest.fn()} setDeleteBillId={jest.fn()} />);
    expect(screen.getByText('Bill 1')).toBeInTheDocument();
    expect(screen.getByText('Bill 2')).toBeInTheDocument();
  });
});


describe('AssignUserSheet', () => {
  test('renders user assignment sheet correctly with provided props', () => {
    const biller = {
      id: 'b1',
      biller_code: '12345',
      name: 'Electricity Provider',
      save_biller_status: true,
      reference_number: '987654321',
    };

    render(
      <AssignUserSheet
        isOpen={true}
        onClose={jest.fn()}
        biller={biller}
        amount={200}
        description="Monthly electricity bill"
        due_date={new Date('2023-05-05')}
        linkedBill="linkedBill123"
        assignedUsers="user1, user2"
        onAssignComplete={jest.fn()}
      />
    );

    // Check for presence of essential information
    expect(screen.getByText('Electricity Provider')).toBeInTheDocument();
    expect(screen.getByText('Monthly electricity bill')).toBeInTheDocument();
    expect(screen.getByText('Due Date:')).toBeInTheDocument();
    expect(screen.getByText('Amount:')).toHaveTextContent('200');
  });

  test('calls onClose when close button is clicked', () => {
    const handleClose = jest.fn();
    const biller = {
      id: 'b1',
      biller_code: '12345',
      name: 'Electricity Provider',
      save_biller_status: true,
      reference_number: '987654321',
    };

    render(
      <AssignUserSheet
        isOpen={true}
        onClose={handleClose}
        biller={biller}
        amount={200}
        description="Monthly electricity bill"
        due_date={new Date('2023-05-05')}
        linkedBill="linkedBill123"
        assignedUsers="user1, user2"
        onAssignComplete={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText('Close')); // Assuming there's a "Close" button
    expect(handleClose).toHaveBeenCalled();
  });

  test('triggers onAssignComplete callback when assignment is completed', async () => {
    const handleAssignComplete = jest.fn().mockResolvedValue(jest.fn());
    const biller = {
      id: 'b1',
      biller_code: '12345',
      name: 'Electricity Provider',
      save_biller_status: true,
      reference_number: '987654321',
    };

    render(
      <AssignUserSheet
        isOpen={true}
        onClose={jest.fn()}
        biller={biller}
        amount={200}
        description="Monthly electricity bill"
        due_date={new Date('2023-05-05')}
        linkedBill="linkedBill123"
        assignedUsers="user1, user2"
        onAssignComplete={handleAssignComplete}
      />
    );

    // Assuming there’s a button or some way to trigger the assignment completion
    fireEvent.click(screen.getByText('Assign User'));

    await waitFor(() => expect(handleAssignComplete).toHaveBeenCalledWith('linkedBill123'));
  });
});


describe('CreateBillForm', () => {
  test('renders form fields correctly', () => {
    render(<CreateBillForm setIsCreatingBill={jest.fn()} fetchBills={jest.fn()} />);
    expect(screen.getByLabelText('Bill Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Amount')).toBeInTheDocument();
  });

  test('displays error message for missing fields', async () => {
    render(<CreateBillForm setIsCreatingBill={jest.fn()} fetchBills={jest.fn()} />);
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => expect(screen.getByText('Please fill in all fields')).toBeInTheDocument());
  });
});


describe('TrashBillDetailSheet', () => {
  test('renders correctly with bill info', () => {
    const bill = { id: '1', description: 'Test Bill' };
    render(
      <TrashBillDetailSheet
        status={true}
        bill={bill}
        onClose={() => jest.fn()}
        deleteBill = {() => jest.fn()}
      />
    );
    expect(screen.getByText('Delete Test Bill')).toBeInTheDocument();
  });

  test('deletes bill on confirm', () => {
    const handleDelete = jest.fn();
    const bill = { id: '1', description: 'Test Bill' };
    render(
      <TrashBillDetailSheet
        status={true}
        bill={bill}
        onClose={() => jest.fn()}
        deleteBill = {() => jest.fn()}
      />
    );
    fireEvent.click(screen.getByText('Delete'));
    expect(handleDelete).toHaveBeenCalled();
  });
});



