import React from 'react';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminDashboard from '@/app/admin/dashboard/page';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store/store';
import { accountAction } from '@/lib/actions/accountAction';

// Mock accountAction to prevent actual async call
jest.mock('@/lib/actions/accountAction', () => ({
  accountAction: {
    fetchPersonalAccountByUserId: jest.fn().mockResolvedValue({ id: 'mockAccount' }),
  },
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/store/hooks', () => ({
  useAppSelector: jest.fn(),
  useAppDispatch: jest.fn(),
}));

jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn().mockReturnValue({
        data: [
          {
            id: 'bill1',
            biller: { name: 'Biller One' },
            amount: 100,
            due_date: '2024-10-01',
          },
          {
            id: 'bill2',
            biller: { name: 'Biller Two' },
            amount: 200,
            due_date: '2024-11-01',
          },
        ],
        error: null,
      }),
    })),
    auth: {
      admin: {
        listUsers: jest.fn().mockResolvedValue({
          data: [
            { id: 'user1', last_sign_in_at: '2024-01-01T00:00:00Z' },
            { id: 'user2', last_sign_in_at: '2024-01-02T00:00:00Z' },
          ],
          error: null,
        }),
      },
    },
    channel: jest.fn(() => ({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn().mockResolvedValue({ status: 'SUBSCRIBED' }),
    })),
    removeChannel: jest.fn(),
  })),
}));




const mockPush = jest.fn();
const mockDispatch = jest.fn();

describe('AdminDashboard', () => {
  beforeAll(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://dummy.supabase.co'; // Use a valid-looking dummy URL
    process.env.NEXT_PUBLIC_SERVICE_ROLE_KEY = 'dummy-service-role-key'; // Dummy service role key
  });

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useAppSelector as jest.Mock).mockImplementation((selector: (state: RootState) => any) => {
      return selector({
        user: {
          user_role: 'admin', // mock admin role
          user_id: '123', // mock user ID
        },
        bank: {},
        transfer: {},
      } as RootState);
    });
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  test('renders AdminDashboard with BankNavbar and AdminSideBar', async () => {
    await act(async () => {
      render(<AdminDashboard />);
    });
    await waitFor(() => {
      expect(screen.getByTestId('bank-navbar')).toBeInTheDocument();
      expect(screen.getByTestId('admin-sidebar')).toBeInTheDocument();
    });
  });

  test('renders AccountsPage by default', async () => {
    await act(async () => {
      render(<AdminDashboard />);
    });
    await waitFor(() => {
      expect(screen.getByTestId('accounts-page')).toBeInTheDocument();
    });
  });

  test('redirects if user is not an admin', async () => {
    (useAppSelector as jest.Mock).mockReturnValueOnce('user'); // Mock non-admin user role
    await act(async () => {
      render(<AdminDashboard />);
    });
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  test('handles click event on <li> element', async () => {
    await act(async () => {
      render(<AdminDashboard />);
    });

    const items = ['accounts', 'presets', 'create-bill', 'content-management-system'];

    for (const item of items) {
      // Find the <li> element by its test ID
      const listItem = screen.getByTestId(`${item}-admin-link-button`);

      // Simulate a click event
      fireEvent.click(listItem);

      // Assert that the selected item message appears
      await waitFor(() => {
        const selectedItem = screen.getByTestId(`${item}-page`);
        expect(selectedItem).toBeInTheDocument();
      });
    }
  });


});
