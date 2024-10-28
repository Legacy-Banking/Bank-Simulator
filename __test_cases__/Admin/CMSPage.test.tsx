import React from 'react';
import { render, screen, fireEvent, waitFor, act, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import CMSPage from '@/components/admin/CMS/CMSPage';


jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn().mockReturnValue({
    toString: jest.fn().mockReturnValue('page=1'),
  }),
  useRouter: jest.fn(),
}));

jest.mock('@/store/hooks', () => ({
  useAppSelector: jest.fn(),
  useAppDispatch: jest.fn(),
}));


// Mocking the Supabase client and its methods
jest.mock('@/lib/supabase/client', () => {
  const originalModule = jest.requireActual('@/lib/supabase/client');
  return {
    ...originalModule,
    createClient: jest.fn(() => {
      console.log('createClient called'); // Log to verify mock usage
      return {
        from: jest.fn(() => ({
          select: jest.fn().mockResolvedValue({
            data: Array.from({ length: 25 }, (_, i) => ({
              id: `constant${i + 1}`,
              key: `key${i + 1}`,
              content: `Content for constant ${i + 1}`,
              page_key: `page_key${i + 1}`,
            })),
            error: null,
          }),
        })),
      };
    }),
  };
});

describe('CMSPage', () => {
  beforeEach(async () => {
    await act(async () => {
      render(<CMSPage />);
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });


  test('renders CMSPage without errors', async () => {
    await waitFor(() => {
      expect(screen.getByTestId('content-management-system-page')).toBeInTheDocument();
      expect(screen.getByTestId('Content Management System')).toBeInTheDocument();
      expect(screen.getByTestId('View all content embeddings')).toBeInTheDocument();
    });
  });

  test('displays loading message initially', () => {
    // Render component and check loading message
    render(<CMSPage />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('there is pagination', async () => {
    await waitFor(() => {
      const paginationElement = screen.getByTestId('pagination');
      expect(paginationElement).toBeInTheDocument();
    });
  });

  test('opens add item detail sheet when AddButton is clicked', async () => {
    const addButton = screen.getByTestId('add-button');
    await fireEvent.click(addButton);
    await waitFor(() => {
      expect(screen.getByTestId('constant-add-detail-sheet')).toBeInTheDocument();
    });
  });

  
});
