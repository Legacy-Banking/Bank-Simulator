// slices/transferSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TransferState {
  isLoading: boolean;
}

const initialState: TransferState = {
  isLoading: false,
};

const transferSlice = createSlice({
  name: 'transfer',
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    stopLoading(state) {
      state.isLoading = false;
    },
  },
});

export const { startLoading, stopLoading } = transferSlice.actions;
export default transferSlice.reducer;
