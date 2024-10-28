import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import TransactionDetailSheet from '@/components/TransactionDetailSheet'
import { formatAmount, formatDateTime } from "@/lib/utils"

const mockTransaction = {
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
}

describe('TransactionDetailSheet Component', () => {
  it('does not render when transaction is null', () => {
    const { container } = render(<TransactionDetailSheet transaction={null} onClose={() => {}} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders dialog with transaction details when transaction is provided', () => {
    render(<TransactionDetailSheet transaction={mockTransaction} onClose={() => {}} />)

    expect(screen.getByText('Transaction Details')).toBeInTheDocument()
    expect(screen.getByText('Detailed information about the selected transaction.')).toBeInTheDocument()

    // Use partial match for the username and check the presence of the "To:" label
    expect(screen.getByText(mockTransaction.to_account_username)).toBeInTheDocument()
    expect(screen.getByText('To:')).toBeInTheDocument()

    expect(screen.getByText(mockTransaction.from_account_username)).toBeInTheDocument()
    expect(screen.getByText(formatDateTime(mockTransaction.paid_on))).toBeInTheDocument()
    expect(screen.getByText(formatAmount(mockTransaction.amount))).toBeInTheDocument()
    expect(screen.getByText(mockTransaction.description)).toBeInTheDocument()
  })

  it('calls onClose when Close button is clicked', () => {
    const handleClose = jest.fn()
    render(<TransactionDetailSheet transaction={mockTransaction} onClose={handleClose} />)

    // Use getAllByText and filter by button role
    const closeButton = screen.getAllByText('Close').find(button => button.tagName === 'BUTTON')
    if (closeButton) fireEvent.click(closeButton)

    expect(handleClose).toHaveBeenCalledTimes(1)
  })
})
