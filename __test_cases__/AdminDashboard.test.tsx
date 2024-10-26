import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminDashboard from '@/app/admin/dashboard/page';
import { useAppSelector } from '@/store/hooks';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store/store';
import { accountAction } from '@/lib/actions/accountAction';

// Mock hooks and components
jest.mock('@/store/hooks', () => ({
  useAppSelector: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@/components/BankNavbar', () => {
  return { __esModule: true, default: () => <div>Mocked BankNavbar</div> };
});
jest.mock('@/components/AdminSide/AdminSideBar', () => {
  return { __esModule: true, default: () => <div>Mocked AdminSideBar</div> };
});

jest.mock('@/components/AdminSide/Accounts/AccountsPage', () => {
  return { __esModule: true, default: () => <div>Mocked AccountsPage</div> };
});
jest.mock('@/components/AdminSide/Bills/CreateBillPage', () => {
  return { __esModule: true, default: () => <div>Mocked CreateBillPage</div> };
});
jest.mock('@/components/AdminSide/Presets/PresetsPage', () => {
  return { __esModule: true, default: () => <div>Mocked PresetsPage</div> };
});
jest.mock('@/components/AdminSide/CMS/CMSPage', () => {
  return { __esModule: true, default: () => <div>Mocked CMSPage</div> };
});

// Mock accountAction to prevent actual async call
jest.mock('@/lib/actions/accountAction', () => ({
  accountAction: {
    fetchPersonalAccountByUserId: jest.fn().mockResolvedValue({ id: 'mockAccount' }),
  },
}));

const mockPush = jest.fn();

describe('AdminDashboard', () => {
  beforeEach(() => {
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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders AdminDashboard with BankNavbar and AdminSideBar', async () => {
    await act(async () => {
      render(<AdminDashboard />);
    });
    expect(screen.getByText('Mocked BankNavbar')).toBeInTheDocument();
    expect(screen.getByText('Mocked AdminSideBar')).toBeInTheDocument();
  });

  test('renders AccountsPage by default', async () => {
    await act(async () => {
      render(<AdminDashboard />);
    });
    await waitFor(() => {
      expect(screen.getByText('Mocked AccountsPage')).toBeInTheDocument();
    });
  });

  test('redirects if user is not an admin', async () => {
    (useAppSelector as jest.Mock).mockReturnValueOnce('user'); // Mock non-admin user role
    await act(async () => {
      render(<AdminDashboard />);
    });
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  test('fetches personal account data when user_id is available', async () => {
    await act(async () => {
      render(<AdminDashboard />);
    });
    await waitFor(() => {
      expect(screen.getByText('Mocked BankNavbar')).toBeInTheDocument();
    });
  });
});
