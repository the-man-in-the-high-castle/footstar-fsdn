import {
  FsdnSquadClubDTO,
  FsdnSquadPermissionsDTO,
  SlotDateDTO,
  SqaudPlayerDTO,
  SquadClubKey,
  SquadMatchDTO
} from "../../api/contracts";
import { ISlotDate } from "./model/SlotDate";

export interface SquadsState {
  club: SquadClubKey;
  fsDate: ISlotDate;
  squads: Record<string, SquadState>;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | undefined;
}

export interface SquadState {
  club: FsdnSquadClubDTO;
  players: SquadItem[];
  matches: SquadMatch[];
  matchAfterSlot?: ISlotDate;
  currentMatchId?: string;
  permissions: FsdnSquadPermissionsDTO;
}

export type FetchedSquad = {
  club: FsdnSquadClubDTO;
  players: SquadItem[];
  matches: SquadMatch[];
  slotDate: SlotDateDTO;
  permissions?: FsdnSquadPermissionsDTO;
};

export interface SquadItem extends SqaudPlayerDTO {
  lastLoginDays?: number;
  lastLoginDaysText: string;
  squad: string;
  experience: string;
  confidence: string;
  fitnessBeforeMatch?: number;
}

export interface SquadMatch extends SquadMatchDTO {}
