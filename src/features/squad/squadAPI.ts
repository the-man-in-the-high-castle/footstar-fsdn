import { client } from "../../api/client";
import { SquadDTO } from "../../api/contracts";

export function fetchSquadApi({
  clubId,
  ageCategory = 0,
  pid,
  token
}: {
  clubId: number;
  ageCategory: number;
  pid: string | number;
  token: string;
}) {
  return client.getApi<SquadDTO>(
    `squad/${clubId}`,
    `?age=${ageCategory}&pid=${pid}`,
    { headers: { authorization: `Bearer ${token}` } }
  );
}
