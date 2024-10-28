import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { TransactionsTable } from '@/components/TransactionsTable'
import { formatAmount, formatDateTime } from '@/lib/utils/utils'

// Mock the TransactionDetailSheet to exclude it from tests
jest.mock('@/components/TransactionDetailSheet', () => () => <div data-testid="transaction-detail-sheet" />)

const mockTransactions = [
    {
      id: '1',
      description: 'Payment for services',
      amount: 100,
      paid_on: new Date('2023-10-25T10:00:00Z'),
      from_account: '123-ABC',
      from_account_username: 'Alice',
      to_account: '456-DEF',
      to_biller: 'Service Co.',
      to_account_username: 'Bob',
      transaction_type: 'credit',
    },
    {
      id: '2',
      description: 'Refund for product',
      amount: -30,
      paid_on: new Date('2023-10-26T11:00:00Z'),
      from_account: '789-GHI',
      from_account_username: 'Charlie',
      to_account: '321-JKL',
      to_biller: 'Retailer Inc.',
      to_account_username: 'Dave',
      transaction_type: 'debit',
    },
  ]
  

describe('TransactionsTable Component', () => {
  it('renders the table headers correctly', () => {
    render(<TransactionsTable transactions={mockTransactions} />)
    
    expect(screen.getByText('Transaction')).toBeInTheDocument()
    expect(screen.getByText('Date')).toBeInTheDocument()
    expect(screen.getByText('Amount')).toBeInTheDocument()
  })

  it('displays transaction data in table rows', () => {
    render(<TransactionsTable transactions={mockTransactions} />)

    // Check that each transaction's data is displayed correctly
    mockTransactions.forEach((transaction) => {
      const accountName = transaction.amount > 0 
        ? transaction.from_account_username 
        : transaction.to_account_username
      const amountDisplay = transaction.amount > 0 
        ? `+${formatAmount(transaction.amount)}`
        : `-${formatAmount(Math.abs(transaction.amount))}`

      expect(screen.getByText(accountName)).toBeInTheDocument()
      expect(screen.getByText(formatDateTime(transaction.paid_on))).toBeInTheDocument()
      expect(screen.getByText(amountDisplay)).toBeInTheDocument()
    })
  })

  it('opens TransactionDetailSheet on row click', () => {
    render(<TransactionsTable transactions={mockTransactions} />)

    // Click on the first transaction row
    const firstTransactionRow = screen.getByText(mockTransactions[0].from_account_username)
    fireEvent.click(firstTransactionRow)

    // Verify that the TransactionDetailSheet is rendered
    expect(screen.getByTestId('transaction-detail-sheet')).toBeInTheDocument()
  })
})
