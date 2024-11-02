import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BillerDropdown } from '@/components/BillerDropDown';
import '@testing-library/jest-dom';

interface BillerAccount {
  id: string;
  name: string;
  biller_code: string;
}

describe('BillerDropdown Component', () => {
  const billerAccounts: BillerAccount[] = [
    { id: '1', name: 'Electricity Provider', biller_code: '123456' },
    { id: '2', name: 'Water Supply', biller_code: '654321' },
    { id: '3', name: 'Gas Company', biller_code: '789012' },
  ];

  it('should display "Choose Biller" text and biller icon when nothing is selected', () => {
    render(
      <BillerDropdown
        billerAccounts={billerAccounts}
        onChange={() => {}}
        label="Select Biller"
        otherStyles="!w-full"
      />
    );

    expect(screen.getByText(/Choose Biller/i)).toBeInTheDocument();
    const icon = screen.getByAltText('biller');
    expect(icon).toBeInTheDocument();
  });

  it('should display the selected biller name when an account is selected', () => {
    render(
      <BillerDropdown
        billerAccounts={billerAccounts}
        onChange={() => {}}
        initialSelected="1"
        label="Select Biller"
        otherStyles="!w-full"
      />
    );

    expect(screen.getByText(/Electricity Provider/i)).toBeInTheDocument();
  });

  it('should display a list of billers with their names and biller codes when the dropdown is opened', async () => {
    render(
      <BillerDropdown
        billerAccounts={billerAccounts}
        onChange={() => {}}
        label="Select Biller"
        otherStyles="!w-full"
      />
    );

    const user = userEvent.setup();
    const trigger = screen.getByRole('combobox');
    await user.click(trigger);

    for (const account of billerAccounts) {
      expect(await screen.findByText(account.name)).toBeInTheDocument();
      expect(
        screen.getByText(`Biller Code: ${account.biller_code}`)
      ).toBeInTheDocument();
    }
  });

  it('should call onChange with the selected biller ID when a biller is selected', async () => {
    const onChangeMock = jest.fn();

    render(
      <BillerDropdown
        billerAccounts={billerAccounts}
        onChange={onChangeMock}
        label="Select Biller"
        otherStyles="!w-full"
      />
    );

    const user = userEvent.setup();

    // Open the dropdown
    const trigger = screen.getByRole('combobox');
    await user.click(trigger);

    // Find and select the first biller
    const firstBiller = await screen.findByText(billerAccounts[0].name);
    await user.click(firstBiller);

    // Expect onChange to have been called with the correct biller ID
    expect(onChangeMock).toHaveBeenCalledWith(billerAccounts[0].id);
  });

  it('should reset the selection when the reset option is chosen', async () => {
    const onChangeMock = jest.fn();
    render(
      <BillerDropdown
        billerAccounts={billerAccounts}
        onChange={onChangeMock}
        initialSelected="1"
        label="Select Biller"
        otherStyles="!w-full"
      />
    );

    const user = userEvent.setup();
    const trigger = screen.getByRole('combobox');
    await user.click(trigger);

    const resetOption = await screen.findByText(/Select Biller/i);
    await user.click(resetOption);

    expect(onChangeMock).toHaveBeenCalledWith('');
    expect(screen.getByText(/Choose Biller/i)).toBeInTheDocument();
  });

  it('should show the correct biller name and code on each item in the dropdown list', async () => {
    render(
      <BillerDropdown
        billerAccounts={billerAccounts}
        onChange={() => {}}
        label="Select Biller"
        otherStyles="!w-full"
      />
    );

    const user = userEvent.setup();
    const trigger = screen.getByRole('combobox');
    await user.click(trigger);

    for (const account of billerAccounts) {
      expect(await screen.findByText(account.name)).toBeInTheDocument();
      expect(
        screen.getByText(`Biller Code: ${account.biller_code}`)
      ).toBeInTheDocument();
    }
  });
});
