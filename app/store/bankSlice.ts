// slices/bankSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Account {
  id: string;
  name: string;
  currentBalance: number;
}

interface BankState {
  accounts: Account[];
  selectedAccount: Account | null;
}

const initialState: BankState = {
  accounts: [],
  selectedAccount: null,
};

const bankSlice = createSlice({
  name: 'bank',
  initialState,
  reducers: {
    setAccounts(state, action: PayloadAction<Account[]>) {
      state.accounts = action.payload;
    },
    selectAccount(state, action: PayloadAction<string>) {
      state.selectedAccount = state.accounts.find(account => account.id === action.payload) || null;
    },
  },
});

export const { setAccounts, selectAccount } = bankSlice.actions;
export default bankSlice.reducer;
