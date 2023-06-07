import { HttpBackendOptions } from "i18next-http-backend";
import { client } from "./api/client";

let token: LoginResp | undefined;
type ErrorResp = { error: { code: "Unauthorized" | string; message: string } };
type LoginResp = {
  access_token: "string";
  expires_in: "string";
  token_type: "string";
  error?: undefined;
};
type TranslationResp = Record<string, string>;

async function login() {
  const resp = await client.post<LoginResp | ErrorResp>(
    import.meta.env.VITE_TRANSLATION_SERVER + "/api/v1/auth/token",
    JSON.stringify({
      grant_type: "client_credentials",
      client_id: import.meta.env.VITE_TRANSLATION_CLIENT_ID,
      client_secret: import.meta.env.VITE_TRANSLATION_CLIENT_SECRET
    })
  );

  return resp.data;
}

export const traduoraOptions: HttpBackendOptions = {
  loadPath:
    import.meta.env.VITE_TRANSLATION_SERVER +
    `/api/v1/projects/${
      import.meta.env.VITE_TRANSLATION_PROJECT_ID
    }/exports?locale={{lng}}&format=jsonnested`,

  allowMultiLoading: false,

  // allow cross domain requests
  crossDomain: true,

  // allow credentials on cross domain requests
  withCredentials: true,

  requestOptions: {
    // used for fetch, can also be a function (payload) => ({ method: 'GET' })
    mode: "cors",
    credentials: "same-origin",
    cache: "default"
  },

  request: async function (options, url, payload, callback) {
    if (!token) {
      const loginResp = await login();
      if (loginResp.error) {
        console.error("Translate service login error", loginResp.error);
        callback("Translate service login error", { status: 400, data: {} });
        return;
      }
      token = loginResp;
    }

    if (!token) {
      callback("no token", { status: 401, data: {} });
      return;
    }

    const resp = await client.get<TranslationResp | ErrorResp>(url, {
      ...options.requestOptions,
      headers: { authorization: `Bearer ${token.access_token}` }
    });

    callback(undefined, mapResponse());

    function mapResponse() {
      return { status: resp.status, data: resp.data };
    }
  },

  // adds parameters to resource URL. 'example.com' -> 'example.com?v=1.3.5'
  //queryStringParams: { v: "1.3.5" },
  reloadInterval: false // can be used to reload resources in a specific interval (useful in server environments)
};
