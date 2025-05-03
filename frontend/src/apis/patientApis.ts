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
  PageRes,
} from "../types";
import { PatientSearchParams } from "../types/types";

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

export const GetAllPatientsApi = () =>
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

export const PatientSearchApi = (
  params: PatientSearchParams,
  page = 0,
  size = 20,
) => {
  const queryParams = new URLSearchParams();

  // Add search parameters
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, value.toString());
    }
  }

  // Add pagination
  queryParams.append("page", page.toString());
  queryParams.append("size", size.toString());

  return fetchFn<null, PageRes<Patient>>(
    `${ENDPOINT.SEARCH_PATIENTS}?${queryParams.toString()}`,
    "GET",
  );
};
