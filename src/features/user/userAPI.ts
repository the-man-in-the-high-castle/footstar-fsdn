import { client } from "../../api/client";
import { FsdnLoginUserDTO, FsdnUserDTO } from "../../api/contracts";

export function fetchUserApi(props: {
  userId: number;
  pid: number;
  token: string;
}) {
  console.log("fetchUserApi");
  return client.postApi<FsdnUserDTO>(
    `user/${props.userId}`,
    undefined,
    { pid: props.pid },
    { headers: { authorization: `Bearer ${props.token}` } }
  );
}

export function loginApi(props: {
  username: string;
  password: string;
  pid: number;
}) {
  return client.postApi<FsdnLoginUserDTO>("login", undefined, props);
}

export function buildInLoginApi() {
  return client.get<FsdnLoginUserDTO>(
    "/community/fsdn_api.asp?method=buildInLogin",
    { headers: { "x-fs-header": "on" } }
  );
}
