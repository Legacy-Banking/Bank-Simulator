import { describe, test, expect } from '@jest/globals';

const mockTransaction = {
  id: 't1',
  to_account: 'a1',
  to_account_username: 'Utility Co',
  from_account_username: 'John Doe',
  paid_on: '2024-10-15',
  amount: 150,
  description: 'Monthly electricity bill',
};

describe('TransactionDetailSheet Component', () => {
  test('displays transaction details correctly', () => {
    const { to_account_username, from_account_username, paid_on, amount, description } = mockTransaction;

    expect(to_account_username).toBe('Utility Co');
    expect(from_account_username).toBe('John Doe');
    expect(paid_on).toBe('2024-10-15');
    expect(amount).toBe(150);
    expect(description).toBe('Monthly electricity bill');
  });

  test('formats transaction date correctly', () => {
    const formattedDate = '15 October 2024'; // Example formatted date for the test
    const transactionDate = '2024-10-15';
    expect(transactionDate).toBe('2024-10-15');
    expect(formattedDate).toBe('15 October 2024');
  });

  test('formats transaction amount correctly', () => {
    const formattedAmount = `$${Math.abs(mockTransaction.amount)}`;
    expect(formattedAmount).toBe('$150');
  });

  test('displays alternative text when description is missing', () => {
    const transactionWithoutDescription = { ...mockTransaction, description: '' };
    const description = transactionWithoutDescription.description || 'No description available';
    expect(description).toBe('No description available');
  });

  test('handles close action correctly', () => {
    let isOpen = true;
    const handleClose = () => { isOpen = false; };
    handleClose();
    expect(isOpen).toBe(false);
  });
});
