// __test_cases__/Login.test.tsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '@/app/auth/login/page'; // Adjust the import path if necessary

// Mock the SubmitButton component to bypass the formAction prop type
jest.mock('@/components/submit-button', () => ({
  SubmitButton: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

describe('Login Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should allow input for username and password', () => {
    render(<Login searchParams={{ message: '' }} />);

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

  it('should display an error message when provided in searchParams', () => {
    const errorMessage = 'Invalid credentials. Please try again!';
    render(<Login searchParams={{ message: errorMessage }} />);

    // Verify that the error message is displayed
    const messageDiv = screen.getByText(errorMessage);
    expect(messageDiv).toBeInTheDocument();
    expect(messageDiv).toHaveClass('text-red-500 mb-4');
  });

  it('should have a "Sign Up" link that redirects to the sign-up page', () => {
    render(<Login searchParams={{ message: '' }} />);

    // Get the "Sign Up" link
    const signUpLink = screen.getByRole('link', { name: 'Sign Up' });

    // Verify that the link is present and has the correct href
    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink).toHaveAttribute('href', '/auth/sign-up');
  });
});
