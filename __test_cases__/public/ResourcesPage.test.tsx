import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Resources from '@/app/(public)/resources/page'; // Adjust the import path as needed
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userReducer, { UserState } from '@/store/userSlice';

// Mock the YouTubeVideo component
jest.mock('@/components/YoutubeVideo', () => (props: any) => (
  <div data-testid="youtube-video">{props.videoUrl}</div>
));

describe('Resources Page', () => {
  // Define userInitialState using the UserState interface
  const userInitialState: UserState = {
    user_id: 'test-id',
    user_name: 'Test User',
    user_role: 'user', // Default role
  };

  const renderWithStore = (userRole: string) => {
    const mockStore = configureStore({
      reducer: {
        user: userReducer,
      },
      preloadedState: {
        user: {
          ...userInitialState,
          user_role: userRole, // Override user_role for the test
        },
      },
    });

    render(
      <Provider store={mockStore}>
        <Resources />
      </Provider>
    );
  };

  it('renders the Resources page correctly for a regular user', () => {
    renderWithStore('user'); // Use 'user' or appropriate role for regular users

    // Check for main headings
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Resources');

    // Check that the regular videos are rendered
    expect(screen.getByText('Getting Started with LearntoBank')).toBeInTheDocument();
    expect(screen.getByText('Sign up, Log in, and Dashboard Overview')).toBeInTheDocument();

    expect(screen.getByText('Managing Transactions')).toBeInTheDocument();
    expect(screen.getByText('Transfer Funds, Pay Anyone, and Cards')).toBeInTheDocument();

    expect(screen.getByText('Bills and Payments with BPAY')).toBeInTheDocument();
    expect(screen.getByText('Viewing, Paying and Managing your Bills')).toBeInTheDocument();

    // Check that the YouTubeVideo components are rendered
    const videos = screen.getAllByTestId('youtube-video');
    expect(videos.length).toBe(3); // Should be 3 videos for regular users

    // Ensure the admin video is not rendered
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
  });

  it('renders the Resources page correctly for an admin user', () => {
    renderWithStore('admin'); // Use 'admin' or appropriate role for admin users

    // Check for main headings
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Resources');

    // Check that all videos are rendered, including the admin video
    expect(screen.getByText('Getting Started with LearntoBank')).toBeInTheDocument();
    expect(screen.getByText('Managing Transactions')).toBeInTheDocument();
    expect(screen.getByText('Bills and Payments with BPAY')).toBeInTheDocument();

    // Admin-specific content
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(
      screen.getByText('Explore the admin features, including managing user accounts and settings.')
    ).toBeInTheDocument();

    // Check that the YouTubeVideo components are rendered
    const videos = screen.getAllByTestId('youtube-video');
    expect(videos.length).toBe(4); // Should be 4 videos for admin users
  });
});
