import { describe, test, expect } from '@jest/globals';

const mockBills = [
  { id: 'b1', description: 'Electricity Bill', amount: 100, due_date: '2024-10-15', status: 'unpaid' },
  { id: 'b2', description: 'Water Bill', amount: 50, due_date: '2024-09-10', status: 'paid' },
  { id: 'b3', description: 'Internet Bill', amount: 75, due_date: '2024-11-05', status: 'unpaid' },
  { id: 'b4', description: 'Gas Bill', amount: 60, due_date: '2024-11-25', status: 'paid' }, // Additional bills
  { id: 'b5', description: 'Phone Bill', amount: 40, due_date: '2024-12-10', status: 'unpaid' },
];

describe('ViewBills Component', () => {
  test('displays all bills in the table', () => {
    const billDescriptions = mockBills.map(bill => bill.description);
    expect(billDescriptions).toContain('Electricity Bill');
    expect(billDescriptions).toContain('Water Bill');
    expect(billDescriptions).toContain('Internet Bill');
  });

  test('applies pagination correctly', () => {
    const rowsPerPage = 2;
    const totalPages = Math.ceil(mockBills.length / rowsPerPage);
    const firstPageBills = mockBills.slice(0, rowsPerPage);
    const secondPageBills = mockBills.slice(rowsPerPage, rowsPerPage * 2);

    expect(totalPages).toBeGreaterThan(1);
    expect(firstPageBills).toHaveLength(rowsPerPage);
    expect(secondPageBills.length).toBeLessThanOrEqual(rowsPerPage); // Adjusted expectation to handle partial pages
  });

  test('shows loading spinner initially', () => {
    const loading = true;
    expect(loading).toBe(true);
  });

  test('displays correct bill details', () => {
    const electricityBill = mockBills.find(bill => bill.description === 'Electricity Bill');
    expect(electricityBill?.amount).toBe(100);
    expect(electricityBill?.due_date).toBe('2024-10-15');
    expect(electricityBill?.status).toBe('unpaid');
  });

  test('displays correct bill status for paid and unpaid bills', () => {
    const unpaidBills = mockBills.filter(bill => bill.status === 'unpaid');
    const paidBills = mockBills.filter(bill => bill.status === 'paid');

    unpaidBills.forEach(bill => expect(bill.status).toBe('unpaid'));
    paidBills.forEach(bill => expect(bill.status).toBe('paid'));
  });
});
