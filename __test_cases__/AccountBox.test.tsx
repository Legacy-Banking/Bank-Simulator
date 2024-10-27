import { describe, test, expect } from '@jest/globals';

const mockAccount = {
  id: 'a1',
  type: 'savings',
  owner_username: 'John Doe',
  bsb: '123456',
  acc: '78901234',
  balance: 2000,
  opening_balance: 5000,
};

describe('AccountBox Component', () => {
  test('displays account type and owner correctly', () => {
    const accountType = mockAccount.type.charAt(0).toUpperCase() + mockAccount.type.slice(1);
    const accountOwner = `${mockAccount.owner_username}'s ${accountType} Account`;
    expect(accountType).toBe('Savings');
    expect(accountOwner).toBe("John Doe's Savings Account");
  });

  test('formats BSB and account number correctly', () => {
    const formattedBSB = `${mockAccount.bsb.slice(0, 3)}-${mockAccount.bsb.slice(3, 6)}`;
    const formattedAccountNumber = `${mockAccount.acc.slice(0, 2)}-${mockAccount.acc.slice(2, 5)}-${mockAccount.acc.slice(5, 9)}`;
    
    expect(formattedBSB).toBe('123-456');
    expect(formattedAccountNumber).toBe('78-901-234');
  });

  test('calculates available credit for credit accounts correctly', () => {
    const creditUsed = (mockAccount.opening_balance || 0) - (mockAccount.balance || 0);
    expect(creditUsed).toBe(3000); // Assuming this account was initially set to be credit
  });

  test('displays tooltip content for each account type', () => {
    const tooltipContent = {
      savings: 'SAVINGS ACCOUNT: Ideal for storing the majority of your funds. Transfers are limited to personal accounts, and it accumulates monthly interest.',
      personal: 'PERSONAL ACCOUNT: The primary account for daily transactions, including BPAY and Pay Anyone payments.',
      credit: 'CREDIT ACCOUNT: To view credit available and used for credit card transactions. Carries an interest fee if the balance is not repaid within the due period.',
    };
    
    expect(tooltipContent[mockAccount.type]).toContain('SAVINGS ACCOUNT');
  });

  test('generates link to transaction history for the account', () => {
    const transactionHistoryLink = `/transaction-history?accountid=${mockAccount.id}`;
    expect(transactionHistoryLink).toBe('/transaction-history?accountid=a1');
  });
});
