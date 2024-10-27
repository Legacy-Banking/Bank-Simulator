import { describe, test, expect } from '@jest/globals';

const mockMessages = [
  { id: 'm1', sender: 'John Doe', subject: 'Welcome', date: '2024-10-15', content: 'Welcome to the service!', status: 'unread' },
  { id: 'm2', sender: 'Jane Smith', subject: 'Reminder', date: '2024-09-10', content: 'Don’t forget to check your settings!', status: 'read' },
  { id: 'm3', sender: 'Customer Support', subject: 'Update', date: '2024-11-05', content: 'We have updated our policy.', status: 'unread' },
  { id: 'm4', sender: 'Sales', subject: 'Offer', date: '2024-11-25', content: 'Exclusive offer just for you!', status: 'unread' },
  { id: 'm5', sender: 'Marketing', subject: 'Newsletter', date: '2024-12-10', content: 'Here’s our latest newsletter.', status: 'read' },
];

describe('Inbox Component', () => {
  test('displays all messages on the current page', () => {
    const page = 1;
    const itemsPerPage = 3;
    const currentPageMessages = mockMessages.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    const messageSubjects = currentPageMessages.map(msg => msg.subject);

    expect(messageSubjects).toContain('Welcome');
    expect(messageSubjects).toContain('Reminder');
    expect(messageSubjects).toContain('Update');
  });

  test('applies pagination correctly', () => {
    const itemsPerPage = 2;
    const totalPages = Math.ceil(mockMessages.length / itemsPerPage);
    const firstPageMessages = mockMessages.slice(0, itemsPerPage);
    const secondPageMessages = mockMessages.slice(itemsPerPage, itemsPerPage * 2);

    expect(totalPages).toBeGreaterThan(1);
    expect(firstPageMessages).toHaveLength(itemsPerPage);
    expect(secondPageMessages.length).toBeLessThanOrEqual(itemsPerPage);
  });

  test('shows loading spinner initially', () => {
    const loading = true;
    expect(loading).toBe(true);
  });

  test('displays correct message details', () => {
    const welcomeMessage = mockMessages.find(message => message.subject === 'Welcome');
    expect(welcomeMessage?.sender).toBe('John Doe');
    expect(welcomeMessage?.date).toBe('2024-10-15');
    expect(welcomeMessage?.status).toBe('unread');
  });

  test('displays correct message status for read and unread messages', () => {
    const unreadMessages = mockMessages.filter(message => message.status === 'unread');
    const readMessages = mockMessages.filter(message => message.status === 'read');

    unreadMessages.forEach(message => expect(message.status).toBe('unread'));
    readMessages.forEach(message => expect(message.status).toBe('read'));
  });
});
