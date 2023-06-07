import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FsdnLoginUserDTO, FsdnUserDTO } from "../../api/contracts";
import { RootState } from "../../app/store";
import { UserState } from "./user.model";
import { fetchUserApi, loginApi } from "./userAPI";
import { getUserToken, removeUserToken, setUserToken } from "./userToken";

const initialState: UserState = {
  userId: 0,
  managerInClubs: [],
  ...getUserToken(),
  status: "idle",
  error: undefined
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      removeUserToken();
      state.userId = 0;
      state.userToken = undefined;
      state.error = undefined;
      state.managerInClubs = [];
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUser.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userId = action.payload.userId;
        state.error = undefined;

        state.managerInClubs = action.payload.managerInClubs;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    builder
      .addCase(login.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userId = action.payload.userId;
        state.userToken = action.payload.userToken;
        state.error = undefined;
        state.managerInClubs = action.payload.managerInClubs;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  }
});

export const fetchUser = createAsyncThunk<
  FsdnUserDTO,
  void,
  { state: RootState }
>("user/fetchUser", async (_, { getState, dispatch }) => {
  const userId = getState().user.userId;
  const token = getState().user.userToken;
  if (!token) {
    dispatch(userSlice.actions.logout);
    return { managerInClubs: [], userId: 0 };
    // throw new Error("No token");
  }

  const { data } = await fetchUserApi({
    userId,
    pid: import.meta.env.VITE_FSDN_PROGRAM_ID,
    token
  });

  return {
    ...data,
    managerInClubs: data.managerInClubs.sort((a, b) =>
      a.clubName.localeCompare(b.clubName)
    )
  };
});

export const login = createAsyncThunk<
  FsdnLoginUserDTO,
  { username: string; password: string }
>("user/login", async (props) => {
  const { data } = await loginApi({
    ...props,
    pid: import.meta.env.VITE_FSDN_PROGRAM_ID
  });

  setUserToken({ userToken: data.userToken, userId: data.userId });

  return {
    ...data,
    managerInClubs: data.managerInClubs.sort((a, b) =>
      a.clubName.localeCompare(b.clubName)
    )
  };
});

export default userSlice.reducer;

export const { logout } = userSlice.actions;

export const selectManagerClubs = (state: RootState) =>
  state.user.managerInClubs;

export const selectManagerClub = (
  state: RootState,
  clubId: number | undefined
) =>
  clubId
    ? state.user.managerInClubs.find((c) => c.clubId === clubId)
    : undefined;

export const selectUserStatus = (state: RootState) => state.user.status;
export const selectUserError = (state: RootState) => state.user.error;

export const selectIsLogged = (state: RootState) => state.user.userId > 0;
