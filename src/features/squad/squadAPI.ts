import { client } from "../../api/client"
import { SquadDTO } from "../../api/contracts"

export function fetchSquad() {
  return client.get<SquadDTO>("/api/players")
}
