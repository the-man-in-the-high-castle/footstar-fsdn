// A tiny wrapper around fetch(), borrowed from
// https://kentcdodds.com/blog/replace-axios-with-a-simple-custom-fetch-wrapper

const baseApiUrl = `${import.meta.env.VITE_API_URL}${
  import.meta.env.VITE_API_URL_PATH
}`;

export async function client<RT>(
  endpoint: RequestInfo,
  { body, ...customConfig }: RequestInit = {}
) {
  const headers: HeadersInit = { "content-type": "application/json" };

  const config: RequestInit = {
    method: body ? "POST" : "GET",
    ...customConfig,
    headers: { ...headers, ...customConfig.headers }
  };

  if (body) config.body = body;

  let data;
  try {
    const response = await window.fetch(endpoint, config);
    data = await response.json();

    if (response.ok) {
      // Return a result object similar to Axios
      return {
        status: response.status,
        data: data as RT,
        headers: response.headers,
        url: response.url
      };
    }
    throw new Error(response.statusText);
  } catch (err: any) {
    console.log("client error", endpoint, JSON.stringify(err), data);
    return Promise.reject(err.message ? err.message : data);
  }
}

client.get = function <RT>(
  endpoint: RequestInfo,
  customConfig: RequestInit = {}
) {
  return client<RT>(endpoint, { ...customConfig, method: "GET" });
};

client.getApi = function <RT>(
  method: string,
  args = "",
  customConfig: RequestInit = {}
) {
  return client<RT>(baseApiUrl + method + args, {
    ...customConfig,
    method: "GET"
  });
};

client.post = function <RT>(
  endpoint: RequestInfo,
  body: BodyInit,
  customConfig: RequestInit = {}
) {
  return client<RT>(endpoint, { ...customConfig, body });
};

client.postApi = function <RT>(
  method: string,
  args = "",
  body: Record<string, unknown>,
  customConfig: RequestInit = {}
) {
  return client<RT>(baseApiUrl + method + (args ?? ""), {
    ...customConfig,
    body: JSON.stringify(body)
  });
};

// export function encodePostParams(params: Record<string, unknown>) {
//   return Object.entries(params)
//     .filter(([, val]) => !!val)
//     .reduce((result, [key, val]) => {
//       // console.info(key, val);
//       if (typeof val === "object") result.append(key, JSON.stringify(val));
//       else result.append(key, "" + val);

//       return result;
//     }, new URLSearchParams())
//     .toString();
// }
