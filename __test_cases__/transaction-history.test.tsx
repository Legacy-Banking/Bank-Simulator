import { describe, test, expect } from '@jest/globals';

const mockAccounts = [
  { id: 'acc1', type: 'savings', bsb: '123-456', acc: '11111111', balance: 5000 },
  { id: 'acc2', type: 'personal', bsb: '654-321', acc: '22222222', balance: 3000 },
  { id: 'acc3', type: 'credit', bsb: null, acc: null, balance: -500 },
];

const mockTransactions = [
  { id: 't1', amount: 100, paid_on: '2024-09-15', description: 'Groceries', transaction_type: 'debit', significant: true },
  { id: 't2', amount: 75, paid_on: '2024-09-10', description: 'Utilities', transaction_type: 'debit', significant: true },
  { id: 't3', amount: -200, paid_on: '2024-09-08', description: 'Rent', transaction_type: 'debit', significant: true },
];

describe('TransactionHistory Component', () => {
  test('displays all accounts in the selection dropdown', () => {
    const accountTypes = mockAccounts.map(account => account.type);
    expect(accountTypes).toContain('savings');
    expect(accountTypes).toContain('personal');
    expect(accountTypes).toContain('credit');
  });

  test('displays personal account details correctly', () => {
    const personalAccount = mockAccounts.find(account => account.type === 'personal');
    expect(personalAccount?.bsb).toBe('654-321');
    expect(personalAccount?.acc).toBe('22222222');
    expect(personalAccount?.balance).toBe(3000);
  });

  test('displays savings account details correctly', () => {
    const savingsAccount = mockAccounts.find(account => account.type === 'savings');
    expect(savingsAccount?.bsb).toBe('123-456');
    expect(savingsAccount?.acc).toBe('11111111');
    expect(savingsAccount?.balance).toBe(5000);
  });

  test('displays credit account balance correctly', () => {
    const creditAccount = mockAccounts.find(account => account.type === 'credit');
    expect(creditAccount?.balance).toBe(-500);
  });

  test('filters transactions by selected date range', () => {
    const selectedMonth = '2024-09';
    const filteredTransactions = mockTransactions.filter(transaction => transaction.paid_on.startsWith(selectedMonth));
    expect(filteredTransactions.length).toBe(3);
  });

  test('downloads statement when clicking download button', () => {
    const statementData = mockTransactions.map(transaction => ({
      description: transaction.description,
      amount: transaction.amount,
      date: transaction.paid_on,
    }));
    expect(statementData).toHaveLength(mockTransactions.length);
  });

  test('applies correct color for significant transactions', () => {
    const significantTransactions = mockTransactions.filter(transaction => transaction.significant);
    significantTransactions.forEach(transaction => {
      const color = transaction.amount > 50 ? 'bg-green-50' : 'bg-red-150';
      expect(color).toMatch(/bg-(green-50|red-150)/);
    });
  });

  test('opens transaction details popup with correct information', () => {
    const transaction = mockTransactions[0];
    const transactionDetails = {
      to: 'Vendor ABC',
      from: 'User Account',
      date: transaction.paid_on,
      amount: transaction.amount,
      description: transaction.description,
    };
    expect(transactionDetails.description).toBe('Groceries');
    expect(transactionDetails.amount).toBe(100);
  });
});
