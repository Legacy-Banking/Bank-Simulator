// __test_cases__/Signup.test.tsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignUp from '@/app/auth/sign-up/page'; 

// Mock the SubmitButton component to bypass the formAction prop type
jest.mock('@/components/submit-button', () => ({
  SubmitButton: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

describe('SignUp Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should allow input for username and password', () => {
    render(<SignUp searchParams={{ message: '' }} />);

    // Get username and password input fields
    const usernameInput = screen.getByPlaceholderText('Enter username');
    const passwordInput = screen.getByPlaceholderText('Enter your password');

    // Verify that inputs are present in the document
    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();

    // Type into username and password fields
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Verify that inputs received the values correctly
    expect(usernameInput).toHaveValue('testuser');
    expect(passwordInput).toHaveValue('password123');
  });

  it('should have a "Login" link that redirects to the login page', () => {
    render(<SignUp searchParams={{ message: '' }} />);

    // Get the "Login" link
    const loginLink = screen.getByRole('link', { name: 'Login' });

    // Verify that the link is present and has the correct href
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/auth/login');
  });
});
