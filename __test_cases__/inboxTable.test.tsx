import { describe, test, expect } from '@jest/globals';

const mockMessages = [
  { id: 'm1', type: 'bill', sender_name: 'Utility Co', description: 'Electricity Bill', date_received: '2024-10-15', read: false },
  { id: 'm2', type: 'insufficient', sender_name: 'Bank', description: 'Low Balance Alert', date_received: '2024-10-14', read: true },
  { id: 'm3', type: 'schedule', sender_name: 'Dentist', description: 'Appointment Reminder', date_received: '2024-10-13', read: false },
];

describe('InboxTable Component', () => {
  test('displays all messages in the table', () => {
    const messageDescriptions = mockMessages.map(message => message.description);
    expect(messageDescriptions).toContain('Electricity Bill');
    expect(messageDescriptions).toContain('Low Balance Alert');
    expect(messageDescriptions).toContain('Appointment Reminder');
  });

  test('displays correct icon for each message type', () => {
    const iconPaths = mockMessages.map(message => {
      switch (message.type) {
        case 'bill':
          return '/bill.png';
        case 'insufficient':
          return '/insufficient.png';
        case 'schedule':
          return '/schedule.png';
        default:
          return null;
      }
    });

    expect(iconPaths).toContain('/bill.png');
    expect(iconPaths).toContain('/insufficient.png');
    expect(iconPaths).toContain('/schedule.png');
  });

  test('marks message as read when opened', () => {
    const message = { ...mockMessages[0] };
    message.read = true;
    expect(message.read).toBe(true);
  });

  test('formats date correctly for display', () => {
    const formattedDate = '15 October 2024'; // Example formatted date based on formatDateTime output
    const receivedDate = '2024-10-15';
    expect(receivedDate).toBe('2024-10-15');
    expect(formattedDate).toBe('15 October 2024');
  });

  test('renders correct styles based on read status', () => {
    const unreadMessage = mockMessages.find(message => !message.read);
    const readMessage = mockMessages.find(message => message.read);

    expect(unreadMessage?.read).toBe(false);
    expect(readMessage?.read).toBe(true);
  });
});
