import { describe, test, expect } from '@jest/globals';

import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';

const mockAccounts = [
  { id: 'acc1', type: 'savings', balance: 1500, bsb: '123-456', acc: '11111111', owner_username: 'John Doe' },
  { id: 'acc2', type: 'personal', balance: 2000, bsb: '654-321', acc: '22222222', owner_username: 'John Doe' },
  { id: 'acc3', type: 'credit', balance: -300, bsb: null, acc: null, owner_username: 'John Doe' },
];

const mockStore = configureStore();
const store = mockStore({ user: { user_id: '12345' } });

describe('Dashboard Component', () => {
  test('renders the user greeting', () => {
    const username = mockAccounts[0].owner_username;
    expect(username).toBe('John Doe');
  });

  test('displays personal account BSB and account number', () => {
    const personalAccount = mockAccounts.find(account => account.type === 'personal');
    expect(personalAccount?.bsb).toBe('654-321');
    expect(personalAccount?.acc).toBe('22222222');
  });

  test('displays personal account balance', () => {
    const personalAccount = mockAccounts.find(account => account.type === 'personal');
    expect(personalAccount?.balance).toBe(2000);
  });

  test('redirects to transaction history for personal account link', () => {
    const personalAccount = mockAccounts.find(account => account.type === 'personal');
    expect(personalAccount?.id).toBe('acc2');
  });

  test('displays savings account BSB and account number', () => {
    const savingsAccount = mockAccounts.find(account => account.type === 'savings');
    expect(savingsAccount?.bsb).toBe('123-456');
    expect(savingsAccount?.acc).toBe('11111111');
  });

  test('displays savings account balance', () => {
    const savingsAccount = mockAccounts.find(account => account.type === 'savings');
    expect(savingsAccount?.balance).toBe(1500);
  });

  test('redirects to transaction history for savings account link', () => {
    const savingsAccount = mockAccounts.find(account => account.type === 'savings');
    expect(savingsAccount?.id).toBe('acc1');
  });

  test('displays credit account balance', () => {
    const creditAccount = mockAccounts.find(account => account.type === 'credit');
    expect(creditAccount?.balance).toBe(-300);
  });

  test('redirects to transaction history for credit account link', () => {
    const creditAccount = mockAccounts.find(account => account.type === 'credit');
    expect(creditAccount?.id).toBe('acc3');
  });

  test('calculates and displays total balance', () => {
    const totalBalance = mockAccounts.reduce((acc, account) => acc + account.balance, 0);
    expect(totalBalance).toBe(3200);
  });
});
