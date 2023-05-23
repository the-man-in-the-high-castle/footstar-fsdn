import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit"
import counterReducer from "../features/counter/counterSlice"
import squadSlice from "../features/squad/squadSlice"

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    squad: squadSlice,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
