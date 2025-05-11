import { fetchFn } from "../fetch";
import { ENDPOINT } from "../fetch/endpoints";
import {
  CreateUserReq,
  CreateUserRes,
  CurrUserinfoReq,
  CurrUserinfoRes,
  ResetPasswordReq,
  ResetPasswordRes,
  UpdateUserReq,
  UpdateUserRes,
  User,
} from "../types";

export const CurrUserinfoApi = () =>
  fetchFn<CurrUserinfoReq, CurrUserinfoRes>(ENDPOINT.CURR_USER_INFO);
export const GetAllUsersApi = () =>
  fetchFn<void, User[]>(ENDPOINT.GET_ALL_USERS);
export const CreateUserApi = (userInfo: CreateUserReq) => () =>
  fetchFn<CreateUserReq, CreateUserRes>(ENDPOINT.CREATE_USER, "POST", userInfo);
export const UpdateUserApi = (updatedUser: User) =>
  fetchFn<UpdateUserReq, UpdateUserRes>(
    ENDPOINT.UPDATE_USER,
    "PUT",
    updatedUser,
  );
export const ResetPasswordApi = (req: ResetPasswordReq) =>
  fetchFn<ResetPasswordReq, ResetPasswordRes>(
    ENDPOINT.RESET_PASSWORD,
    "PUT",
    req,
  );
