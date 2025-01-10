import {
  CreatePatientReq,
  CreatePatientRes,
  CreatePaymentReq,
  CreatePaymentRes,
  CreateUserReq,
  CreateUserRes,
  CreateVisitReq,
  CreateVisitRes,
  CurrUserinfoReq,
  CurrUserinfoRes,
  LoginReq,
  LoginRes,
  Patient,
  Payment,
  Visit,
} from "../types";
import { ENDPOINT } from "./endpoints";
import { fetchFn } from "./index";

export const loginApi = (identifier: string, password: string) =>
  fetchFn<LoginReq, LoginRes>(ENDPOINT.LOGIN, "POST", { identifier, password });

export const CurrUserinfoApi = () =>
  fetchFn<CurrUserinfoReq, CurrUserinfoRes>(ENDPOINT.CURR_USER_INFO);

export const GetAllUsersApi = () => fetchFn(ENDPOINT.GET_ALL_USERS);

export const CreateUserApi = (userInfo: CreateUserReq) => () =>
  fetchFn<CreateUserReq, CreateUserRes>(ENDPOINT.CREATE_USER, "POST", userInfo);

export const CreatePatientApi = (patient: Patient) => () =>
  fetchFn<CreatePatientReq, CreatePatientRes>(
    ENDPOINT.CREATE_PATIENT,
    "POST",
    patient,
  );

export const CreateVisitApi = (visit: Visit) => () =>
  fetchFn<CreateVisitReq, CreateVisitRes>(ENDPOINT.CREATE_VISIT, "POST", visit);

export const CreatePaymentApi = (payment: Payment) => () =>
  fetchFn<CreatePaymentReq, CreatePaymentRes>(
    ENDPOINT.CREATE_PAYMENT,
    "POST",
    payment,
  );
