// __test_cases__/AboutUs.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AboutUs from '@/app/(public)/about-us/page';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt || 'Mocked Image'} />;
  },
}));

describe('AboutUs Page', () => {
  it('renders the About Us page correctly', () => {
    render(<AboutUs />);

    // Check for main headings
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('About Us');
    expect(screen.getByRole('heading', { level: 2, name: /Our Project Lead/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Our Success Team/i })).toBeInTheDocument();

    // Check for specific text
    expect(screen.getByText(/The LearntoBank online banking simulator has been created/i)).toBeInTheDocument();
    expect(screen.getByText(/It is designed to help seniors learn how to use an online banking system/i)).toBeInTheDocument();
    expect(screen.getByText(/Cheryl is an IT tutor who specializes in delivering programs/i)).toBeInTheDocument();

    // Check for team member names
    expect(screen.getByText('Khye Shen Tan')).toBeInTheDocument();
    expect(screen.getByText('Aidan Chong')).toBeInTheDocument();
    expect(screen.getByText('Samuel Qi')).toBeInTheDocument();
    expect(screen.getByText('Fredrick Yang')).toBeInTheDocument();
    expect(screen.getByText('Saite Guo')).toBeInTheDocument();

    // Optionally, check for images (since we've mocked them)
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0); // Ensure images are rendered
  });
});
