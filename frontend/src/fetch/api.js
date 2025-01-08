import { fetchFn } from "./index";

export const loginApi = (identifier, password) =>
  fetchFn({
    endPoint: "/api/v1/auth/login",
    method: "POST",
    req: { identifier, password },
  });

export const CurrUserinfoApi = (token) =>
  fetchFn({
    endPoint: "/api/v1/auth/userInfo",
    token,
  });
