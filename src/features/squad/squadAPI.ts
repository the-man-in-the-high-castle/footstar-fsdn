import { client } from "../../api/client";
import { SquadDTO } from "../../api/contracts";

export function fetchSquadApi(clubId: number, ageCategory: number = 0) {
  return client.getApi<SquadDTO>("squad", `&id=${clubId}&age=${ageCategory}`);
}
