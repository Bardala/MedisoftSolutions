import { LoginReq, LoginRes } from "../dto";
import { fetchFn } from "../fetch";
import { ENDPOINT } from "../fetch/endpoints";

// *auth & user

export const loginApi = (identifier: string, password: string) =>
  fetchFn<LoginReq, LoginRes>(ENDPOINT.LOGIN, "POST", { identifier, password });
