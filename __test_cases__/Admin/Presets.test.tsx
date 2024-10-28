import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import PresetsPage from '@/components/AdminSide/Presets/PresetsPage';
import { Provider } from 'react-redux';
import { store } from '@/store/store';

describe('PresetsPage', () => {
  test('renders PresetsPage and checks title and description', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <PresetsPage />
        </Provider>
      );
    });

    expect(screen.getByTestId('Presets')).toBeInTheDocument();
    expect(screen.getByTestId('View and edit all of the preset accounts, transaction and billers presets')).toBeInTheDocument();
  });

  test('renders preset options and allows switching between tables', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <PresetsPage />
        </Provider>
      );
    });

    const accountsButton = screen.getByTestId('preset-option-accounts');
    const transactionsButton = screen.getByTestId('preset-option-transaction');
    const billersButton = screen.getByTestId('preset-option-billers');

    await act(async () => {
      fireEvent.click(transactionsButton);
    });
    expect(transactionsButton).toHaveClass('active');

    await act(async () => {
      fireEvent.click(billersButton);
    });
    expect(billersButton).toHaveClass('active');

    await act(async () => {
      fireEvent.click(accountsButton);
    });
    expect(accountsButton).toHaveClass('active');
  });

  test('renders add button and shows add detail sheet on click', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <PresetsPage />
        </Provider>
      );
    });

    const addButton = screen.getByTestId('add-button');
    await act(async () => {
      fireEvent.click(addButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('add-preset-detail-sheet')).toBeInTheDocument();
    });
  });

  test('displays loading message initially', async () => {
    render(<PresetsPage />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
  
  
});
