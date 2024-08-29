
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import bankReducer from './bankSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    // Add other reducers here as needed
    bank: bankReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
