import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { PaymentWhenOptions } from '@/components/PaymentWhenOptions';
import { useForm, FormProvider } from 'react-hook-form';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

// Mock DatePicker component
jest.mock('@/components/DatePicker', () => ({
  DatePicker: ({ name }: { name: string }) => <div>DatePicker - {name}</div>,
}));

// Mock Select components (if necessary)
jest.mock('@/components/ui/select', () => ({
  Select: ({ children }: any) => <div>{children}</div>,
  SelectTrigger: ({ children, ...props }: any) => (
    <div {...props} role="button">
      {children}
    </div>
  ),
  SelectValue: ({ placeholder }: any) => <div>{placeholder}</div>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectGroup: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children, ...props }: any) => (
    <div {...props} role="option">
      {children}
    </div>
  ),
}));

describe('PaymentWhenOptions Component', () => {
  const Wrapper = () => {
    const formMethods = useForm();
    return (
      <FormProvider {...formMethods}>
        <form>
          <PaymentWhenOptions />
        </form>
      </FormProvider>
    );
  };

  it('renders without crashing', () => {
    render(<Wrapper />);

    expect(screen.getByText('Pay Now')).toBeInTheDocument();
    expect(screen.getByText('Schedule Payment')).toBeInTheDocument();
    expect(screen.getByText('Recurring Payment')).toBeInTheDocument();
  });

  it('selecting Pay Now option', async () => {
    render(<Wrapper />);

    const user = userEvent.setup();

    // Click on Pay Now checkbox
    const payNowCheckbox = screen.getByLabelText('Pay Now');
    await user.click(payNowCheckbox);

    // Ensure no additional fields are displayed
    expect(screen.queryByText(/Select Payment Date/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Frequency/i)).not.toBeInTheDocument();
  });

  it('selecting Schedule Payment option', async () => {
    render(<Wrapper />);

    const user = userEvent.setup();

    // Click on Schedule Payment checkbox
    const scheduleCheckbox = screen.getByLabelText('Schedule Payment');
    await user.click(scheduleCheckbox);

    // Ensure the date picker is displayed
    expect(screen.getByText('Select Payment Date')).toBeInTheDocument();
    expect(screen.getByText('DatePicker - scheduleDate')).toBeInTheDocument();
  });

  it('selecting Recurring Payment option', async () => {
    render(<Wrapper />);

    const user = userEvent.setup();

    // Click on Recurring Payment checkbox
    const recurringCheckbox = screen.getByLabelText('Recurring Payment');
    await user.click(recurringCheckbox);

    // Ensure frequency dropdown and start date picker are displayed
    expect(screen.getByText('Frequency')).toBeInTheDocument();
    expect(screen.getByText('Select Start Date')).toBeInTheDocument();
    expect(screen.getByText('DatePicker - recurringStartDate')).toBeInTheDocument();
  });

  it('selecting Set End Date option under Recurring Payment', async () => {
    render(<Wrapper />);

    const user = userEvent.setup();

    // Click on Recurring Payment checkbox
    const recurringCheckbox = screen.getByLabelText('Recurring Payment');
    await user.click(recurringCheckbox);

    // Click on Set End Date checkbox
    const setEndDateCheckbox = screen.getByLabelText('Set End Date');
    await user.click(setEndDateCheckbox);

    // Ensure the end date picker is displayed
    expect(screen.getByText('DatePicker - endDate')).toBeInTheDocument();
  });

  it('selecting Number of Payments option under Recurring Payment', async () => {
    render(<Wrapper />);

    const user = userEvent.setup();

    // Click on Recurring Payment checkbox
    const recurringCheckbox = screen.getByLabelText('Recurring Payment');
    await user.click(recurringCheckbox);

    // Click on Number of Payments checkbox
    const numberOfPaymentsCheckbox = screen.getByLabelText('Number of Payments');
    await user.click(numberOfPaymentsCheckbox);

    // Ensure the input field is displayed
    expect(screen.getByPlaceholderText('Enter number of payments')).toBeInTheDocument();
  });

it('selecting one payment option deselects others', async () => {
    render(<Wrapper />);

    const user = userEvent.setup();

    const payNowCheckbox = screen.getByLabelText('Pay Now');
    const scheduleCheckbox = screen.getByLabelText('Schedule Payment');
    const recurringCheckbox = screen.getByLabelText('Recurring Payment');

    // Select Pay Now
    await user.click(payNowCheckbox);
    expect(payNowCheckbox).toBeChecked();
    expect(scheduleCheckbox).not.toBeChecked();
    expect(recurringCheckbox).not.toBeChecked();

    // Select Schedule Payment
    await user.click(scheduleCheckbox);
    expect(payNowCheckbox).not.toBeChecked();
    expect(scheduleCheckbox).toBeChecked();
    expect(recurringCheckbox).not.toBeChecked();

    // Select Recurring Payment
    await user.click(recurringCheckbox);
    expect(payNowCheckbox).not.toBeChecked();
    expect(scheduleCheckbox).not.toBeChecked();
    expect(recurringCheckbox).toBeChecked();
  });

  it('switching between payment options resets fields appropriately', async () => {
    render(<Wrapper />);

    const user = userEvent.setup();

    const scheduleCheckbox = screen.getByLabelText('Schedule Payment');
    const recurringCheckbox = screen.getByLabelText('Recurring Payment');

    // Select Schedule Payment
    await user.click(scheduleCheckbox);
    expect(screen.getByText('DatePicker - scheduleDate')).toBeInTheDocument();

    // Switch to Recurring Payment
    await user.click(recurringCheckbox);
    expect(screen.queryByText('DatePicker - scheduleDate')).not.toBeInTheDocument();
    expect(screen.getByText('DatePicker - recurringStartDate')).toBeInTheDocument();
  });

});
