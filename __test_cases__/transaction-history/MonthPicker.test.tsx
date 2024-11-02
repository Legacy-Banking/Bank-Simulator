// __test_cases__/MonthPicker.test.tsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MonthPicker from '@/components/MonthPicker';

describe('MonthPicker', () => {
  const mockOnMonthChange = jest.fn();

  beforeEach(() => {
    render(<MonthPicker currentMonth={new Date(2024, 0, 1)} onMonthChange={mockOnMonthChange} />);
  });

  test('displays the current year', () => {
    expect(screen.getByText('2024')).toBeInTheDocument(); // Check for year directly
  });

  test('changes to the previous year when clicking the previous button', () => {
    const previousButton = screen.getByLabelText(/go to previous year/i);
    fireEvent.click(previousButton);

    expect(screen.getByText('2023')).toBeInTheDocument(); // Check for the updated year
  });

  test('does not allow changing to the next year when it is the current year', () => {
    const nextButton = screen.getByLabelText(/go to next year/i);
    expect(nextButton).toBeDisabled(); // Ensure the next button is disabled
  });

  test('calls onMonthChange with the selected month', () => {
    const monthButton = screen.getByText(/oct/i); // Use getByText to find the button by the month name
    fireEvent.click(monthButton);

    expect(mockOnMonthChange).toHaveBeenCalledWith(new Date(2024, 9, 1)); // October 2024
  });
});
