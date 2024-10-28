import { render, fireEvent } from '@testing-library/react';
import { Pagination } from '@/components/Pagination';
import { useRouter, useSearchParams } from 'next/navigation';

// Mock the router and searchParams
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    useSearchParams: jest.fn(),
}));

describe('Pagination Component', () => {
    const setPageMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
        (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('page=1'));
    });

    it('renders correctly with given page and total pages', () => {
        const { getByText, getByTestId } = render(
            <Pagination page={1} totalPages={3} setPage={setPageMock} />
        );

        expect(getByTestId('pagination')).toBeInTheDocument();
        expect(getByText('1 / 3')).toBeInTheDocument();
        expect(getByText('Prev')).toBeInTheDocument();
        expect(getByText('Next')).toBeInTheDocument();
    });

    it('checks for the presence of the "Next" button', () => {
        const { getByText } = render(
            <Pagination page={1} totalPages={3} setPage={setPageMock} />
        );

        const nextButton = getByText('Next');
        expect(nextButton).toBeInTheDocument();
    });

    it('checks for the presence of the "Prev" button', () => {
        const { getByText } = render(
            <Pagination page={2} totalPages={3} setPage={setPageMock} />
        );

        const prevButton = getByText('Prev');
        expect(prevButton).toBeInTheDocument();
    });

    it('disables the "Prev" button on the first page', () => {
        const { getByText } = render(
            <Pagination page={1} totalPages={3} setPage={setPageMock} />
        );

        const prevButton = getByText('Prev');
        expect(prevButton).toBeDisabled();
    });

    it('disables the "Next" button on the last page', () => {
        const { getByText } = render(
            <Pagination page={3} totalPages={3} setPage={setPageMock} />
        );

        const nextButton = getByText('Next');
        expect(nextButton).toBeDisabled();
    });
});
