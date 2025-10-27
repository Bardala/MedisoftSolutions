import {
  PatientReqDTO,
  PatientResDTO,
  PatientRegistryRes,
  PageRes,
} from "@/dto";
import { PatientSearchParams, PatientStatistics } from "@/shared";
import { ENDPOINT } from "../config/endpoints";
import { fetchFn } from "../http-client/fetchFn";

export const CreatePatientApi = (patient: PatientReqDTO) => () =>
  fetchFn<PatientReqDTO, PatientResDTO>(
    ENDPOINT.CREATE_PATIENT,
    "POST",
    patient,
  );

export const PatientRegistryApi = (patientId: number) =>
  fetchFn<void, PatientRegistryRes>(ENDPOINT.PATIENT_REGISTRY, "GET", null, [
    patientId.toString(),
  ]);

export const GetAllPatientsApi = () =>
  fetchFn<void, PatientResDTO[]>(ENDPOINT.GET_ALL_PATIENTS);

export const DailyNewPatientsApi = (date) =>
  fetchFn<void, PatientResDTO[]>(`${ENDPOINT.DAILY_NEW_PATIENTS}?date=${date}`);

export const UpdatePatientApi = (patient: PatientReqDTO) =>
  fetchFn<PatientReqDTO, PatientResDTO>(
    ENDPOINT.UPDATE_PATIENT,
    "PUT",
    patient,
  );

export const DeletePatientApi = (patientId: number) =>
  fetchFn<void, void>(ENDPOINT.DELETE_PATIENT, "DELETE", undefined, [
    patientId + "",
  ]);

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

  return fetchFn<null, PageRes<PatientResDTO>>(
    `${ENDPOINT.SEARCH_PATIENTS}?${queryParams.toString()}`,
  );
};

export const PatientBatch = (ids: number[]) =>
  fetchFn<void, PatientResDTO[]>(
    `${ENDPOINT.PATIENT_BATCH}?ids=${ids.join(",")}`,
  );

export const PatientApi = {
  create: (patient: PatientReqDTO) =>
    fetchFn<PatientReqDTO, PatientResDTO>(
      ENDPOINT.CREATE_PATIENT,
      "POST",
      patient,
    ),

  Get: (patientId: number) =>
    fetchFn<void, PatientResDTO>(ENDPOINT.GET_PATIENT_BY_ID, "GET", undefined, [
      patientId + "",
    ]),

  getRegistry: (patientId: number) =>
    fetchFn<void, PatientRegistryRes>(ENDPOINT.PATIENT_REGISTRY, "GET", null, [
      patientId.toString(),
    ]),

  getAll: () => fetchFn<void, PatientResDTO[]>(ENDPOINT.GET_ALL_PATIENTS),

  getDaily: (date: string) =>
    fetchFn<void, PatientResDTO[]>(
      `${ENDPOINT.DAILY_NEW_PATIENTS}?date=${date}`,
    ),

  update: (patient: PatientReqDTO, patientId: number) =>
    fetchFn<PatientReqDTO, PatientResDTO>(
      ENDPOINT.UPDATE_PATIENT,
      "PUT",
      patient,
      [patientId + ""],
    ),

  delete: (patientId: number) =>
    fetchFn<void, void>(ENDPOINT.DELETE_PATIENT, "DELETE", undefined, [
      patientId.toString(),
    ]),

  search: (params: PatientSearchParams, page = 0, size = 20) => {
    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    }
    queryParams.append("page", page.toString());
    queryParams.append("size", size.toString());
    return fetchFn<null, PageRes<PatientResDTO>>(
      `${ENDPOINT.SEARCH_PATIENTS}?${queryParams.toString()}`,
    );
  },

  getBatch: (ids: number[]) =>
    fetchFn<void, PatientResDTO[]>(
      `${ENDPOINT.PATIENT_BATCH}?ids=${ids.join(",")}`,
    ),

  getStatistics: () =>
    fetchFn<void, PatientStatistics>(ENDPOINT.PATIENT_STATISTICS),
};
