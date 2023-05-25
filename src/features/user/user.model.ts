import { FsdnClubManagerDTO } from "../../api/contracts";

export interface UserState {
  userId: number;
  managerInClubs: FsdnClubManagerDTO[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | undefined;
}
