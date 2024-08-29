
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import bankReducer from './bankSlice'
import transferReducer from './transferSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    // Add other reducers here as needed
    bank: bankReducer,
    transfer: transferReducer,  // Add the transfer reducer
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
