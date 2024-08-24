import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// Define a type for the slice state
interface UserState {
    user_id: string;
}

const initialState: UserState = {
    user_id: '',
};

// Create user slice
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUserId: (state, action: PayloadAction<string>) => {
      state.user_id = action.payload;
    },
  },
});

export const { updateUserId } = userSlice.actions;


export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const selectUserId = (state: RootState) => state.user.user_id;
export default userSlice.reducer;
