// __test_cases__/RootNavBar.test.tsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RootNavbar from '@/components/RootNavbar'; // Adjust the import path if necessary
import { homeNavLinks } from '@/constants'; // Mocked below
import userEvent from '@testing-library/user-event';

// 1. Mock the useRouter hook from next/navigation first
const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// 2. Mock next/link to render a simple anchor tag that uses the mocked router
jest.mock('next/link', () => {
    return ({ href, children, onClick, ...props }: any) => {
      const { useRouter } = require('next/navigation');
      const router = useRouter();
      const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        router.push(href);
        if (onClick) onClick(e); // Call the component's onClick if it exists
      };
      return (
        <a href={href} onClick={handleClick} {...props}>
          {children}
        </a>
      );
    };
  });

// 3. Mock next/image to render a simple img tag
jest.mock('next/image', () => {
  return ({ src, alt, ...props }: any) => {
    return <img src={src} alt={alt} {...props} />;
  };
});

// 4. Mock the SubmitButton component to bypass the formAction prop type
jest.mock('@/components/submit-button', () => ({
  SubmitButton: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

// 5. Mock the homeNavLinks constant
jest.mock('@/constants', () => ({
  homeNavLinks: [
    { label: 'Home', route: '/' },
    { label: 'About Us', route: '/about-us' },
    { label: 'Resources', route: '/resources' },
  ],
}));

describe('RootNavbar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {}); // Suppress console.log from handleLogout
  });

  it('renders the RootNavbar correctly', () => {
    render(<RootNavbar />);

    // Check for the logo image
    const logoImage = screen.getByAltText('LearntoBank');
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute('src', '/logo.png');

    // Check for the brand name
    const brandName = screen.getByText(/LearntoBank/i);
    expect(brandName).toBeInTheDocument();

    // Check for all navigation links
    homeNavLinks.forEach((link) => {
      const navLinks = screen.getAllByRole('link', { name: link.label });
      expect(navLinks.length).toBeGreaterThanOrEqual(1); // At least one link exists
      navLinks.forEach((linkElement) => {
        expect(linkElement).toHaveAttribute('href', link.route);
      });
    });

    // Check for the Log In button
    const loginButton = screen.getByRole('button', { name: /Log In/i });
    expect(loginButton).toBeInTheDocument();
    expect(loginButton.closest('a')).toHaveAttribute('href', '/auth/login');
  });

  it('navigates to the correct page when a navigation link is clicked', async () => {
    const user = userEvent.setup();
    render(<RootNavbar />);

    for (const link of homeNavLinks) {
      const navLinks = screen.getAllByRole('link', { name: link.label });
      // Find the link that corresponds to the current route
      const navLink = navLinks.find((linkEl) => linkEl.getAttribute('href') === link.route);
      expect(navLink).toBeInTheDocument();
      if (navLink) {
        await user.click(navLink);
        expect(mockPush).toHaveBeenCalledWith(link.route);
        mockPush.mockClear(); // Clear mock after each iteration
      }
    }
  });

  it('navigates to the login page when "Log In" button is clicked', async () => {
    const user = userEvent.setup();
    render(<RootNavbar />);

    const loginButton = screen.getByRole('button', { name: /Log In/i });
    const loginLink = loginButton.closest('a');

    expect(loginLink).toHaveAttribute('href', '/auth/login');

    await user.click(loginButton);
    // handleLogout calls router.push('/') and Link's onClick calls router.push('/auth/login')
    expect(mockPush).toHaveBeenCalledWith('/auth/login');
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('renders the notice below the navbar', () => {
    render(<RootNavbar />);

    const noticeText = /PLEASE NOTE: LearnToBank is only a simulation \(fake banking website\). Transactions are simulations only\./i;
    const notice = screen.getByText(noticeText);
    expect(notice).toBeInTheDocument();

    // To check the parent div's classes, traverse to the parent
    const parentDiv = notice.parentElement; // Use parentElement instead of closest('div')
    expect(parentDiv).toHaveClass('bg-yellow-300 text-center py-3');
  });
});
