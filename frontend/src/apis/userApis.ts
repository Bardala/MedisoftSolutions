import { UserReqDTO, UserResDTO } from "../dto";
import { fetchFn } from "../fetch";
import { ENDPOINT } from "../fetch/endpoints";

export const CurrUserinfoApi = () =>
  fetchFn<void, UserResDTO>(ENDPOINT.CURR_USER_INFO);

export const GetAllUsersApi = () =>
  fetchFn<void, UserResDTO[]>(ENDPOINT.GET_ALL_USERS);

export const CreateUserApi = (userInfo: UserReqDTO) => () =>
  fetchFn<UserReqDTO, UserResDTO>(ENDPOINT.CREATE_USER, "POST", userInfo);

export const UpdateUserApi = (updatedUser: UserReqDTO) =>
  fetchFn<UserReqDTO, UserResDTO>(ENDPOINT.UPDATE_USER, "PUT", updatedUser);

export const ResetPasswordApi = (newPassword: string) =>
  fetchFn<string, void>(ENDPOINT.RESET_PASSWORD, "PUT", newPassword);

export const GetUserBatch = (ids: number[]) =>
  fetchFn<void, UserResDTO[]>(
    `${ENDPOINT.USER_BATCH}?ids=${ids.join(",")}`,
    "GET",
  );

export const UserApi = {
  getCurrent: () => fetchFn<void, UserResDTO>(ENDPOINT.CURR_USER_INFO),

  getAll: () => fetchFn<void, UserResDTO[]>(ENDPOINT.GET_ALL_USERS),

  create: (userInfo: UserReqDTO) => () =>
    fetchFn<UserReqDTO, UserResDTO>(ENDPOINT.CREATE_USER, "POST", userInfo),

  update: (updatedUser: UserReqDTO) =>
    fetchFn<UserReqDTO, UserResDTO>(ENDPOINT.UPDATE_USER, "PUT", updatedUser),

  resetPassword: (newPassword: string) =>
    fetchFn<string, void>(ENDPOINT.RESET_PASSWORD, "PUT", newPassword),

  getBatch: (ids: number[]) =>
    fetchFn<void, UserResDTO[]>(
      `${ENDPOINT.USER_BATCH}?ids=${ids.join(",")}`,
      "GET",
    ),
};
