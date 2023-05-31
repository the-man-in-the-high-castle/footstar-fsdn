import { client } from "../../api/client";
import { FsdnUserDTO } from "../../api/contracts";

export function fetchUserApi() {
  return client.getApi<FsdnUserDTO>("user");
}

export function loginApi(props: {
  username: string;
  password: string;
  pid: number;
}) {
  return client.postApi<FsdnUserDTO>("login", undefined, props);
}
