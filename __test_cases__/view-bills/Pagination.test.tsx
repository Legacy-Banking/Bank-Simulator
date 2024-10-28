import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Pagination } from '@/components/Pagination';
import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe('Pagination Component', () => {
  const mockPush = jest.fn();
  const mockSetPage = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('?page=1'));
    mockPush.mockClear();
    mockSetPage.mockClear();
  });

  const paginationProps = {
    page: 2,
    totalPages: 5,
    setPage: mockSetPage,
  };

  test('renders current page and total pages', () => {
    render(<Pagination {...paginationProps} />);

    expect(screen.getByText('2 / 5')).toBeInTheDocument();
  });

  test('calls handleNavigation with "prev" and updates the page', () => {
    render(<Pagination {...paginationProps} />);

    const prevButton = screen.getByText('Prev');
    fireEvent.click(prevButton);

    expect(mockSetPage).toHaveBeenCalledWith(1);
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('page=1'), { scroll: false });
  });

  test('calls handleNavigation with "next" and updates the page', () => {
    render(<Pagination {...paginationProps} />);

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    expect(mockSetPage).toHaveBeenCalledWith(3);
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('page=3'), { scroll: false });
  });

  test('disables prev button when on the first page', () => {
    render(<Pagination {...paginationProps} page={1} />);

    const prevButton = screen.getByText('Prev');
    expect(prevButton).toBeDisabled();
  });

  test('disables next button when on the last page', () => {
    render(<Pagination {...paginationProps} page={5} />);

    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeDisabled();
  });
});
