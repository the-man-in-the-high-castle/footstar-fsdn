import {
  PayloadAction,
  createAsyncThunk,
  createSelector,
  createSlice
} from "@reduxjs/toolkit";
import {
  ConfidenceEnum,
  SqaudPlayerDTO,
  SquadClubKey
} from "../../api/contracts";
import { AppThunk, RootState } from "../../app/store";
import { FetchedSquad, SquadItem, SquadsState } from "./Squad.model";
import { FitnessCalculator } from "./model/FitnessCalculator";
import { SlotDate } from "./model/SlotDate";
import { fetchSquadApi } from "./squadAPI";

const initialState: SquadsState = {
  club: { clubId: 0, ageCategory: 0 },
  fsDate: { day: 0, slot: 0 },
  squads: {},
  status: "idle",
  error: undefined
};

function squadKey({ clubId, ageCategory }: SquadClubKey) {
  return `${clubId}_${ageCategory}`;
}

const squadSlice = createSlice({
  name: "squad",
  initialState,
  reducers: {
    changeClub: (state, { payload }: PayloadAction<SquadClubKey>) => {
      if (payload && state.squads[squadKey(payload)]) {
        state.club = payload;
      }
    },
    changeMatchDate: (state, action: PayloadAction<string>) => {
      const squad = state.squads[squadKey(state.club)];
      if (!squad) return;
      squad.currentMatchId = action.payload;
      squad.matchAfterSlot = squad.matches.find(
        (m) => m.id === squad.currentMatchId
      )?.afterSlot;

      if (squad.matchAfterSlot) {
        const calc = new FitnessCalculator(
          SlotDate.fromSlot(state.fsDate),
          SlotDate.fromSlot(squad.matchAfterSlot)
        );
        squad.players.forEach((p) => {
          if (p.fitness && p.training) {
            p.fitnessBeforeMatch = calc.calculate(p, lastTrainings());
          }

          function lastTrainings(): number[] {
            if (state.fsDate.slot > 1) return [];
            return p.training.trainingBonus === 1
              ? [p.training.lastTrainingId, 0]
              : [p.training.lastTrainingId, p.training.lastTrainingId];
          }
        });
      }
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchSquad.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchSquad.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.squads[squadKey(payload.club)] = {
          ...state.squads[squadKey(payload.club)],
          players: payload.players,
          matches: payload.matches,
          permissions: payload.permissions ?? {
            startingEleven: false,
            training: false
          },
          club: payload.club
        };
        state.club = { ...payload.club };
        state.fsDate = payload.slotDate;
      })
      .addCase(fetchSquad.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  }
});

export const fetchSquad = createAsyncThunk<
  FetchedSquad,
  SquadClubKey,
  { state: RootState }
>("squad/fetchSquad", async ({ clubId, ageCategory }) => {
  const { data } = await fetchSquadApi(clubId, ageCategory);

  const result: FetchedSquad = {
    club: data.club,
    slotDate: data.slotDate,
    players: mapPlayers(data.players),
    matches: data.matches,
    permissions: data.permissions
  };

  return result;

  function mapPlayers(players: SqaudPlayerDTO[]): SquadItem[] {
    return players
      .sort((a, b) => (a.positionId ?? 0) - (b.positionId ?? 0))
      .map(mapPlayer);
  }
  function mapPlayer(p: SqaudPlayerDTO): SquadItem {
    return {
      ...p,
      lastLoginDaysText: lastLoginDaysText(p),
      squad: p.inYouthTeam ? "U19" : "Main",
      experience: expText(p),
      confidence: confidenceText(p),
      confidenceProblem: hasConfidenceProblem(p),
      matchOrders: p.matchOrders
    };
  }

  function lastLoginDaysText(p: SqaudPlayerDTO): string {
    return p.userId
      ? p.lastLoginDays !== undefined
        ? p.lastLoginDays.toString()
        : ""
      : "BOT";
  }

  function expText(p: SqaudPlayerDTO): string {
    return data.dictionaries.experience[p.experienceId];
  }

  function confidenceText(p: SqaudPlayerDTO): string {
    return p.confidenceId
      ? data.dictionaries.confidence[p.confidenceId - 1]
      : "";
  }

  function hasConfidenceProblem(p: SqaudPlayerDTO): boolean {
    return (
      !!p.confidenceId &&
      p.confidenceId !== ConfidenceEnum.High &&
      p.confidenceId !== ConfidenceEnum.VeryHigh
    );
  }
});

export const fetchPlayersCombo =
  (clubId: number, ageCategory: number = 0): AppThunk =>
  async (dispatch, getState) => {
    if (!clubId) return;

    dispatch(changeClub({ clubId, ageCategory }));
    if (!selectSquad(getState(), { clubId, ageCategory })) {
      await dispatch(fetchSquad({ clubId, ageCategory }));
    }

    const firstMatch = selectMatches(getState(), { clubId, ageCategory })?.[0];

    if (firstMatch) dispatch(changeMatchDate(firstMatch.id));
  };

export default squadSlice.reducer;

export const { changeMatchDate, changeClub } = squadSlice.actions;

export const selectAllSquads = (state: RootState) => state.squad.squads;

const selectSquadKey = (
  state: RootState,
  { clubId, ageCategory }: { clubId: number | undefined; ageCategory: number }
) => (clubId ? squadKey({ clubId, ageCategory }) : undefined);

export const selectSquad = createSelector(
  [selectAllSquads, selectSquadKey],
  (squads, key) => (key ? squads[key] : undefined)
);

export const selectPlayers = createSelector(
  [selectSquad],
  (squad) => squad?.players ?? []
);

export const selectMatches = createSelector(
  [selectSquad],
  (squad) => squad?.matches ?? []
);

export const selectSquadStatus = (state: RootState) => state.squad.status;

export const selectCurrentMatchId = createSelector(
  [selectSquad],
  (squad) => squad?.currentMatchId ?? 0
);
