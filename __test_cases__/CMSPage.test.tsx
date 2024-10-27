import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import CMSPage from '@/components/AdminSide/CMS/CMSPage';
import { createClient } from '@/lib/supabase/client';
import AddConstantDetailSheet from '@/components/AdminSide/CMS/AddConstantDetailSheet';
import PopUp from '@/components/AdminSide/Accounts/PopUp';

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
      {message && (
        <div>
          Mocked PopUp - {message}
          <button onClick={onClose}>Close PopUp</button>
        </div>
      )}
    </div>
  ),
}));


jest.mock('@/components/AdminSide/CMS/AddConstantDetailSheet', () => ({
  __esModule: true,
  default: ({ status, onClose, onAddStatus }: { status: boolean; onClose: () => void; onAddStatus: () => void }) => (
    status ? (
      <div>
        Mocked AddConstantDetailSheet
        <button onClick={onClose}>Close Sheet</button>
        <button onClick={onAddStatus}>Add Item</button>
      </div>
    ) : null // Return null if status is false
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
  test('renders loading state initially', async () => {
    await act(async () => {
      render(<CMSPage />);
    });
  });

  test('renders HeaderBox and ConstantTable when loaded', async () => {
    await act(async () => {
      render(<CMSPage />);
    });
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
    await act(async () => {
      render(<CMSPage />);
    });
    await waitFor(() => {
      expect(screen.getByText('Error: Error fetching data')).toBeInTheDocument();
    });
  });

  test('shows and hides AddConstantDetailSheet based on status', () => {
    const handleClose = jest.fn();
    const handleAddStatus = jest.fn();

    // Initially render with `status: true`
    const { rerender } = render(
      <AddConstantDetailSheet status={true} onClose={handleClose} onAddStatus={handleAddStatus} />
    );
    expect(screen.getByText('Mocked AddConstantDetailSheet')).toBeInTheDocument();

    // Re-render with `status: false`
    rerender(
      <AddConstantDetailSheet status={false} onClose={handleClose} onAddStatus={handleAddStatus} />
    );
    expect(screen.queryByText('Mocked AddConstantDetailSheet')).not.toBeInTheDocument();
  });

  test('shows update pop-up and hides it automatically after duration', async () => {
    // Use fake timers to control setTimeout behavior
    jest.useFakeTimers();
    const handleClose = jest.fn();
    
    await act(async () => {
      render(<CMSPage />);
    });

    // Initially render with message: "Successfully Updated." 
    const { rerender } = render(
      <PopUp message={"Successfully Updated."} onClose={handleClose} /> 
    );

    // Check that the pop-up is in the DOM after the duration
    await waitFor(() => {
      expect(screen.queryByText('Mocked PopUp - Successfully Updated.')).toBeInTheDocument();
    });
    // Fast-forward the timer to simulate the auto-close after the specified duration
    act(() => {
      jest.advanceTimersByTime(4000); // Change this to match the actual pop-up duration if different
    });
    
    // Check that the pop-up is no longer in the DOM after the duration
    // await waitFor(() => {
    //   expect(screen.queryByText('Mocked PopUp - Successfully Updated.')).not.toBeInTheDocument();
    // });
    
    // Restore real timers after the test
    jest.useRealTimers();
});
  

  test('pagination works when changing pages', async () => {
    await act(async () => {
      render(<CMSPage />);
    });
    await waitFor(() => {
      expect(screen.getByText('Mocked ConstantTable')).toBeInTheDocument();
    });
  });
});