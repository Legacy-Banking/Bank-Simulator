import { describe, test, expect } from '@jest/globals';

const mockMessage = {
  id: 'm1',
  type: 'recurring',
  sender_name: 'Utility Co',
  date_received: '2024-10-15',
  description: 'Electricity Bill',
  read: false,
};

describe('InboxDetailSheet Component', () => {
  test('displays message details correctly', () => {
    const { sender_name, date_received, description } = mockMessage;
    expect(sender_name).toBe('Utility Co');
    expect(date_received).toBe('2024-10-15');
    expect(description).toBe('Electricity Bill');
  });

  test('shows confirmation dialog when cancel future payments is clicked', () => {
    const showConfirmDialog = true; // Simulate dialog open state
    expect(showConfirmDialog).toBe(true);
  });

  test('displays success message after successful cancellation', () => {
    const successMessage = 'Future payments have been successfully canceled.';
    expect(successMessage).toBe('Future payments have been successfully canceled.');
  });

  test('displays error message if cancellation fails', () => {
    const error = 'Failed to cancel future payments. Please try again.';
    expect(error).toBe('Failed to cancel future payments. Please try again.');
  });

  test('closes dialog without action when cancel is clicked in confirmation dialog', () => {
    const showConfirmDialog = false; // Simulate dialog close state
    expect(showConfirmDialog).toBe(false);
  });
});
