import { fetchFn } from "../fetch";
import { ENDPOINT } from "../fetch/endpoints";
import { LoginReq, LoginRes } from "../types";

// *auth & user

export const loginApi = (identifier: string, password: string) =>
  fetchFn<LoginReq, LoginRes>(ENDPOINT.LOGIN, "POST", { identifier, password });
