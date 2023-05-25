import { client } from "../../api/client";
import { FsdnUserDTO } from "../../api/contracts";

export function fetchUserApi() {
  return client.getApi<FsdnUserDTO>("user");
}
