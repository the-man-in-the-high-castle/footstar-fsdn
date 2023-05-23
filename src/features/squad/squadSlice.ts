import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  ConfidenceEnum,
  SqaudPlayerDTO,
  SquadMatchDTO,
} from "../../api/contracts";
import { AppThunk, RootState } from "../../app/store";
import { FitnessCalculator } from "./model/FitnessCalculator";
import { ISlotDate, SlotDate } from "./model/SlotDate";
import { fetchSquad } from "./squadAPI";

export interface SquadItem extends SqaudPlayerDTO {
  lastLoginDays?: number;
  lastLoginDaysText: string;
  squad: string;
  experience: string;
  confidence: string;
  //matchOrders: MatchOrdersStatuses;
  fitnessBeforeMatch?: number;
}

export interface SquadMatch extends SquadMatchDTO {}

export interface SquadState {
  fsDate: ISlotDate;
  matchAfterSlot?: ISlotDate;
  players: SquadItem[];
  matches: SquadMatch[];
  currentMatchId?: string;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | undefined;
}

const initialState: SquadState = {
  fsDate: { day: 0, slot: 0 },
  players: [],
  matches: [],
  status: "idle",
  error: undefined,
};

const squadSlice = createSlice({
  name: "squad",
  initialState,
  reducers: {
    changeMatchDate: (state, action: PayloadAction<string>) => {
      state.currentMatchId = action.payload;
      state.matchAfterSlot = state.matches.find(
        (m) => m.id === state.currentMatchId,
      )?.afterSlot;

      console.log(state.matches);

      if (state.matchAfterSlot) {
        const calc = new FitnessCalculator(
          SlotDate.fromSlot(state.fsDate),
          SlotDate.fromSlot(state.matchAfterSlot),
        );
        state.players.forEach((p) => {
          if (p.fitness) {
            p.fitnessBeforeMatch = calc.calculate(p, [14, 14]);
          }
        });
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPlayers.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchPlayers.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Add any fetched posts to the array
        state.players = state.players.concat(action.payload.players);
        state.matches = state.matches.concat(action.payload.matches);
      })
      .addCase(fetchPlayers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const fetchPlayers = createAsyncThunk<{
  players: SquadItem[];
  matches: SquadMatch[];
}>("squad/fetchPlayers", async (_, { dispatch }) => {
  const response = await fetchSquad();

  const result: { players: SquadItem[]; matches: SquadMatch[] } = {
    players: mapPlayers(response.data.players),
    matches: response.data.matches,
  };

  return result;

  function mapPlayers(players: SqaudPlayerDTO[]): SquadItem[] {
    return players
      .sort((a, b) => (a.positionId ?? 0) - (b.positionId ?? 0))
      .map((p) => ({
        ...p,
        lastLoginDaysText: p.userId
          ? p.lastLoginDays !== undefined
            ? p.lastLoginDays.toString()
            : ""
          : "BOT",
        squad: p.inYouthTeam ? "U19" : "Main",
        experience: response.data.dictionaries.experience[p.experienceId],
        confidence: p.confidenceId
          ? response.data.dictionaries.confidence[p.confidenceId - 1]
          : "",
        confidenceProblem:
          !!p.confidenceId &&
          p.confidenceId !== ConfidenceEnum.High &&
          p.confidenceId !== ConfidenceEnum.VeryHigh,
        matchOrders: p.matchOrders,
      }));
  }
});

export const fetchPlayersCombo = (): AppThunk => async (dispatch, getState) => {
  await dispatch(fetchPlayers());
  if (getState().squad.matches.length)
    dispatch(changeMatchDate(getState().squad.matches[0].id));
};

export default squadSlice.reducer;

export const { changeMatchDate } = squadSlice.actions;

export const selectAllPlayers = (state: RootState) => state.squad.players;
export const selectAllMatches = (state: RootState) => state.squad.matches;
export const selectPlayersStatus = (state: RootState) => state.squad.status;

export const selectCurrentMatchId = (state: RootState) =>
  state.squad.currentMatchId;
