import { fetchFn } from "../http-client/fetchFn";
import { ENDPOINT } from "../config/endpoints";
import { UserResDTO, UserReqDTO, UpdateUserReqDTO } from "@/dto";

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

  create: (userInfo: UserReqDTO) =>
    // () =>
    fetchFn<UserReqDTO, UserResDTO>(ENDPOINT.CREATE_USER, "POST", userInfo),

  createOwner: (userInfo: UserReqDTO, clinicId: number) =>
    fetchFn<UserReqDTO, UserResDTO>(ENDPOINT.CREATE_OWNER, "POST", userInfo, [
      clinicId.toString(),
    ]),

  update: (req: { updatedUser: UpdateUserReqDTO; id?: number }) =>
    req.id
      ? fetchFn<UpdateUserReqDTO, UserResDTO>(
          ENDPOINT.UPDATE_USER_BY_ID,
          "PUT",
          req.updatedUser,
          [req.id + ""],
        )
      : fetchFn<UpdateUserReqDTO, UserResDTO>(
          ENDPOINT.UPDATE_USER,
          "PUT",
          req.updatedUser,
        ),

  resetPassword: (newPassword: string) =>
    fetchFn<string, void>(ENDPOINT.RESET_PASSWORD, "PUT", newPassword),

  getBatch: (ids: number[]) =>
    fetchFn<void, UserResDTO[]>(
      `${ENDPOINT.USER_BATCH}?ids=${ids.join(",")}`,
      "GET",
    ),

  getClinicStaff: (clinicId: number) =>
    fetchFn<void, UserResDTO[]>(ENDPOINT.GET_CLINIC_STAFF, "GET", undefined, [
      clinicId.toString(),
    ]),
};
