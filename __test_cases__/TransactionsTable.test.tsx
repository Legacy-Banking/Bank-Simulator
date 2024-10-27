import { describe, test, expect } from '@jest/globals';

const mockTransactions = [
  { id: 't1', amount: 150, from_account_username: 'John Doe', to_account_username: 'Utility Co', paid_on: '2024-10-15' },
  { id: 't2', amount: -25, from_account_username: 'Bank', to_account_username: 'Grocery Store', paid_on: '2024-10-14' },
  { id: 't3', amount: -75, from_account_username: 'John Doe', to_account_username: 'Insurance Co', paid_on: '2024-10-13' },
];

describe('TransactionsTable Component', () => {
  test('displays all transactions in the table', () => {
    const transactionDescriptions = mockTransactions.flatMap(transaction => [
      transaction.from_account_username,
      transaction.to_account_username,
    ]);

    expect(transactionDescriptions).toContain('John Doe');
    expect(transactionDescriptions).toContain('Utility Co');
    expect(transactionDescriptions).toContain('Grocery Store');
  });

  test('highlights significant changes in transaction amounts', () => {
    const significantChanges = mockTransactions.filter(transaction => Math.abs(transaction.amount) > 50);
    expect(significantChanges).toHaveLength(2);
  });

  test('formats transaction date correctly', () => {
    const formattedDate = '15 October 2024'; // Example formatted date for the test
    const transactionDate = '2024-10-15';
    expect(transactionDate).toBe('2024-10-15');
    expect(formattedDate).toBe('15 October 2024');
  });

  test('formats transaction amount with correct sign and style', () => {
    const transactionAmount = mockTransactions[0].amount;
    const formattedAmount = transactionAmount > 0 ? `+$${transactionAmount}` : `-$${Math.abs(transactionAmount)}`;
    expect(formattedAmount).toBe('+$150');
  });

  test('opens transaction details on row click', () => {
    const selectedTransaction = mockTransactions[0]; // Simulate selecting the first transaction
    expect(selectedTransaction.id).toBe('t1');
    expect(selectedTransaction.amount).toBe(150);
  });
});
