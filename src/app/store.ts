import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import squadSlice from "../features/squad/squadSlice";
import userSlice from "../features/user/userSlice";

export const store = configureStore({
  reducer: {
    squad: squadSlice,
    user: userSlice
  }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
