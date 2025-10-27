import { LoginReq, LoginRes } from "@/dto";
import { ENDPOINT } from "../config/endpoints";
import { fetchFn } from "../http-client/fetchFn";

export const loginApi = (identifier: string, password: string) =>
  fetchFn<LoginReq, LoginRes>(ENDPOINT.LOGIN, "POST", { identifier, password });
