import React from 'react';
import { render, screen, act } from '@testing-library/react';
import Home from '@/app/page'; // Adjust import based on your directory
import '@testing-library/jest-dom';
import { contentAction } from '@/lib/actions/contentAction';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/store/userSlice';
import { useRouter } from 'next/navigation';

// Set dummy environment variables for Supabase
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://ueuxycryiojbgkujsgqx.supabase.co/';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVldXh5Y3J5aW9qYmdrdWpzZ3F4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMxNjk4MDgsImV4cCI6MjAzODc0NTgwOH0.J1V0AmOYYK58hH0zz2wlr7sqNxcyFWSATwgUWWZmXm4';

// Mock fetchEmbedding function
jest.spyOn(contentAction, 'fetchEmbedding').mockResolvedValue({
    title: 'Test Title',
    subtitle: 'Test Subtitle',
    start_encourage: 'Test Login or Sign Up Message',
    resource_column1_title: 'Test Resource 1',
    resource_column1_description: 'Test Description 1',
    resource_column2_title: 'Test Resource 2',
    resource_column2_description: 'Test Description 2',
    resource_column3_title: 'Test Resource 3',
    resource_column3_description: 'Test Description 3',
  });
  
  // Mock the Supabase client
  jest.mock('@/lib/supabase/client', () => ({
    createClient: jest.fn(() => ({
      auth: {
        getSession: jest.fn().mockResolvedValue({
          data: { session: null },
          error: null,
        }),
      },
    })),
  }));
  
  // Mock useRouter implementation
  jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
  }));
  
  // Mock store
  const mockStore = configureStore({
    reducer: {
      user: userReducer,
    },
    preloadedState: {
      user: {
        user_id: '1',
        user_name: 'Test User',
        user_role: 'Admin',
      },
    },
  });
  
  function HomeWrapper() {
    const [element, setElement] = React.useState<React.ReactElement | null>(null);
  
    React.useEffect(() => {
      (async () => {
        const elem = await Home();
        setElement(elem);
      })();
    }, []);
  
    return element;
  }
  
  describe('Home page', () => {
    beforeAll(() => {
      // Mock useRouter return values
      (useRouter as jest.Mock).mockReturnValue({
        push: jest.fn(), // Mock router push
        replace: jest.fn(),
        back: jest.fn(),
        prefetch: jest.fn(),
      });
    });
  
    it('renders the Home page correctly', async () => {
      await act(async () => {
        render(
          <Provider store={mockStore}>
            <HomeWrapper />
          </Provider>
        );
      });
  
      expect(await screen.findByText('Test Title')).toBeInTheDocument();
      expect(await screen.findByText('Test Subtitle')).toBeInTheDocument();
      expect(await screen.findByText('Test Login or Sign Up Message')).toBeInTheDocument();
      expect(await screen.findByText('Test Resource 1')).toBeInTheDocument();
      expect(await screen.findByText('Test Resource 2')).toBeInTheDocument();
      expect(await screen.findByText('Test Resource 3')).toBeInTheDocument();
    });
  });