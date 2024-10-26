import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CMSPage from '@/components/AdminSide/CMS/CMSPage';
import { createClient } from '@/lib/supabase/client';

// Mock the components
jest.mock('@/components/HeaderBox', () => ({ __esModule: true, default: () => <div>Mocked HeaderBox</div> }));
jest.mock('@/components/AdminSide/CMS/ConstantTable', () => ({ __esModule: true, default: () => <div>Mocked ConstantTable</div> }));
jest.mock('@/components/Pagination', () => ({
  __esModule: true,
  default: ({ totalPages, page, setPage }: { totalPages: number; page: number; setPage: (page: number) => void }) => (
    <div>
      Mocked Pagination
      <button onClick={() => setPage(page + 1)}>Next</button>
    </div>
  ),
}));

jest.mock('@/components/AdminSide/Accounts/PopUp', () => ({
  __esModule: true,
  default: ({ message, onClose }: { message: string; onClose: () => void }) => (
    <div>
      Mocked PopUp - {message}
      <button onClick={onClose}>Close PopUp</button>
    </div>
  ),
}));

jest.mock('@/components/AdminSide/CMS/AddConstantDetailSheet', () => ({
  __esModule: true,
  default: ({ status, onClose, onAddStatus }: { status: boolean; onClose: () => void; onAddStatus: () => void }) => (
    <div>
      Mocked AddConstantDetailSheet
      <button onClick={onClose}>Close Sheet</button>
      <button onClick={onAddStatus}>Add Item</button>
    </div>
  ),
}));


// Mock Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockResolvedValue({ data: [{ id: 1, name: 'Test Constant' }], error: null }),
    }),
  }),
}));

describe('CMSPage', () => {
  test('renders loading state initially', () => {
    render(<CMSPage />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders HeaderBox and ConstantTable when loaded', async () => {
    render(<CMSPage />);
    await waitFor(() => {
      expect(screen.getByText('Mocked HeaderBox')).toBeInTheDocument();
      expect(screen.getByText('Mocked ConstantTable')).toBeInTheDocument();
    });
  });

  test('displays error message if data fetching fails', async () => {
    // Mock error response for the Supabase client
    (createClient().from('content_embeddings').select as jest.Mock).mockResolvedValueOnce({
      data: null,
      error: { message: 'Error fetching data' },
    });
    render(<CMSPage />);
    await waitFor(() => {
      expect(screen.getByText('Error: Error fetching data')).toBeInTheDocument();
    });
  });

  test('toggles AddConstantDetailSheet when Add Button is clicked', async () => {
    render(<CMSPage />);
    const addButton = screen.getByRole('button');
    fireEvent.click(addButton);
    await waitFor(() => {
      expect(screen.getByText('Mocked AddConstantDetailSheet')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Close Sheet'));
    expect(screen.queryByText('Mocked AddConstantDetailSheet')).not.toBeInTheDocument();
  });

  test('shows update pop-up when triggered', async () => {
    render(<CMSPage />);
    fireEvent.click(screen.getByText('Add Item')); // Triggering add action
    await waitFor(() => {
      expect(screen.getByText('Mocked PopUp - Successfully Updated.')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Close PopUp'));
    expect(screen.queryByText('Mocked PopUp - Successfully Updated.')).not.toBeInTheDocument();
  });

  test('pagination works when changing pages', async () => {
    render(<CMSPage />);
    await waitFor(() => {
      expect(screen.getByText('Mocked ConstantTable')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Next'));
    // Add checks related to page state if required
  });
});
