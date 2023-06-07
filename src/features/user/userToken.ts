export type UserTokenInfo = {
  userToken: string | undefined;
  userId: number;
};

const tokenKey = "userToken";

export function setUserToken(tokenInfo: UserTokenInfo): void {
  sessionStorage.setItem(tokenKey, JSON.stringify(tokenInfo));
}

export function getUserToken(): UserTokenInfo | undefined {
  const tokenString = sessionStorage.getItem(tokenKey);
  //console.log("getUserToken, tokenString", tokenString);
  if (!tokenString) return;
  return JSON.parse(tokenString) as UserTokenInfo;
}

export function removeUserToken(): void {
  sessionStorage.removeItem(tokenKey);
}

// const useToken = () => {
//   const getToken = () => {
//     const tokenString = sessionStorage.getItem("token");
//     if (!tokenString) return;
//     const userToken = JSON.parse(tokenString);
//     return userToken?.token;
//   };

//   const [token, setToken] = useState(getToken());

//   const saveToken = (userToken: UserTokenInfo) => {
//     sessionStorage.setItem("token", JSON.stringify(userToken));
//     setToken(userToken.token);
//   };
//   return { setToken: saveToken, token };
// };

// export default useToken;
