import { fetchFn } from "../fetch";
import { ENDPOINT } from "../fetch/endpoints";
import {
  Patient,
  CreatePatientReq,
  CreatePatientRes,
  DailyNewPatientsReq,
  DailyNewPatientsRes,
  DeleteFileRes,
  DeletePatientReq,
  GetAllPatientsReq,
  GetAllPatientsRes,
  PatientRegistryReq,
  PatientRegistryRes,
  UpdatePatientReq,
  UpdatePatientRes,
} from "../types";

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

export const DailyNewPatientsApi = (date) =>
  fetchFn<DailyNewPatientsReq, DailyNewPatientsRes>(
    `${ENDPOINT.DAILY_NEW_PATIENTS}?date=${date}`,
  );

export const UpdatePatientApi = (patient: Patient) =>
  fetchFn<UpdatePatientReq, UpdatePatientRes>(
    ENDPOINT.UPDATE_PATIENT,
    "PUT",
    patient,
  );

export const DeletePatientApi = (patientId: number) =>
  fetchFn<DeletePatientReq, DeleteFileRes>(
    ENDPOINT.DELETE_PATIENT,
    "DELETE",
    undefined,
    [patientId + ""],
  );
