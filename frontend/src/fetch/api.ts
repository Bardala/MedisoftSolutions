import {
  CreatePatientReq,
  CreatePatientRes,
  CreatePaymentReq,
  CreatePaymentRes,
  CreateUserReq,
  CreateUserRes,
  CreateVisitPaymentReq,
  CreateVisitPaymentRes,
  CreateVisitReq,
  CreateVisitRes,
  CurrUserinfoReq,
  CurrUserinfoRes,
  GetAllDentalProcedureReq,
  GetAllDentalProcedureRes,
  GetAllPatientsReq,
  GetAllPatientsRes,
  LoginReq,
  LoginRes,
  Patient,
  PatientRegistryReq,
  PatientRegistryRes,
  recordVisitDentalProcedureReq,
  recordVisitDentalProcedureRes,
} from "../types";
import { ENDPOINT } from "./endpoints";
import { fetchFn } from "./index";

// *auth & user
export const loginApi = (identifier: string, password: string) =>
  fetchFn<LoginReq, LoginRes>(ENDPOINT.LOGIN, "POST", { identifier, password });

export const CurrUserinfoApi = () =>
  fetchFn<CurrUserinfoReq, CurrUserinfoRes>(ENDPOINT.CURR_USER_INFO);

export const GetAllUsersApi = () => fetchFn(ENDPOINT.GET_ALL_USERS);

export const CreateUserApi = (userInfo: CreateUserReq) => () =>
  fetchFn<CreateUserReq, CreateUserRes>(ENDPOINT.CREATE_USER, "POST", userInfo);

// *patient
export const CreatePatientApi = (patient: Patient) => () =>
  fetchFn<CreatePatientReq, CreatePatientRes>(
    ENDPOINT.CREATE_PATIENT,
    "POST",
    patient,
  );

export const PatientRegistryApi = (patientId: number) =>
  fetchFn<PatientRegistryReq, PatientRegistryRes>(
    ENDPOINT.PATIENT_REGISTRY,
    "GET",
    null,
    [patientId.toString()],
  );

export const GetAllPatients = () =>
  fetchFn<GetAllPatientsReq, GetAllPatientsRes>(ENDPOINT.GET_ALL_PATIENTS);

// *visit
export const CreateVisitApi = (visit: CreateVisitReq) =>
  fetchFn<CreateVisitReq, CreateVisitRes>(ENDPOINT.CREATE_VISIT, "POST", visit);

// *payment
export const CreatePaymentApi = (payment: CreatePaymentReq) =>
  fetchFn<CreatePaymentReq, CreatePaymentRes>(
    ENDPOINT.CREATE_PAYMENT,
    "POST",
    payment,
  );

// *DentalProcedure
export const GetAllDentalProceduresApi = () =>
  fetchFn<GetAllDentalProcedureReq, GetAllDentalProcedureRes>(
    ENDPOINT.GET_ALL_DENTAL_PROCEDURES,
  );

// *VisitDentalProcedure
export const RecordVisitDentalProcedureApi = (
  visitDentalProcedure: recordVisitDentalProcedureReq,
) =>
  fetchFn<recordVisitDentalProcedureReq, recordVisitDentalProcedureRes>(
    ENDPOINT.POST_VISIT_DENTAL_PROCEDURE,
    "POST",
    visitDentalProcedure,
  );

// *VisitPayment
export const CreateVisitPaymentApi = (visitPayment: CreateVisitPaymentReq) =>
  fetchFn<CreateVisitPaymentReq, CreateVisitPaymentRes>(
    ENDPOINT.POST_VISIT_PAYMENT,
    "POST",
    visitPayment,
  );
