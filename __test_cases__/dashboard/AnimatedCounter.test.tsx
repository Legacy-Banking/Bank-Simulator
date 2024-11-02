import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AnimatedCounter from '@/components/AnimatedCounter';

describe('AnimatedCounter Component', () => {
  test('renders without crashing', async () => {
    render(<AnimatedCounter amount={100} />);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Wait for 1.5 seconds
    await waitFor(() => expect(screen.getByText(/\$100\.00/)).toBeInTheDocument());
  });

  test('displays correct amount with decimals', async () => {
    render(<AnimatedCounter amount={123.45} />);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Wait for 1.5 seconds
    await waitFor(() => expect(screen.getByText(/\$123\.45/)).toBeInTheDocument());
  });

  test('updates display with new amount', async () => {
    const { rerender } = render(<AnimatedCounter amount={50} />);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Wait for 1.5 seconds
    await waitFor(() => expect(screen.getByText(/\$50\.00/)).toBeInTheDocument());

    // Rerender with a new amount
    rerender(<AnimatedCounter amount={75} />);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Wait for 1.5 seconds
    await waitFor(() => expect(screen.getByText(/\$75\.00/)).toBeInTheDocument());
  });
});
