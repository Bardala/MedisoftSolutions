/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { Patient, Payment, User, Visit } from "./";

export interface LoginRes {
  token: string;
  username: string;
}

export interface LoginReq {
  identifier: string;
  password: string;
}

export interface LoginProviderProps {
  children: React.ReactNode;
}

export type CreateUserReq = Omit<User, "id">;
export type CreateUserRes = Required<LoginRes>;

export interface CurrUserinfoReq {}
export type CurrUserinfoRes = User | null;

export interface CreatePatientReq extends Patient {}
export interface CreatePatientRes extends Patient {}

export interface CreateVisitReq extends Visit {}
export interface CreateVisitRes extends Visit {}

export interface CreatePaymentReq extends Payment {}
export interface CreatePaymentRes extends Payment {}
