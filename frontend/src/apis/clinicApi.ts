// clinic.api.ts
import {
  ClinicReqDTO,
  ClinicResDTO,
  ClinicSettingsResDTO,
  ClinicSettingsReqDTO,
  ClinicLimitsResDTO,
  ClinicLimitsReqDTO,
  ClinicSearchReq,
  ClinicWithOwnerRes,
  ClinicWithOwnerReq,
  ClinicUsageRes,
} from "../dto";
import { fetchFn } from "../fetch";
import { ENDPOINT } from "../fetch/endpoints";
import { Page } from "../types";

export const ClinicApi = {
  /**For system dashboard admin */
  create: (clinic: ClinicReqDTO) =>
    fetchFn<ClinicReqDTO, ClinicResDTO>(ENDPOINT.CREATE_CLINIC, "POST", clinic),

  /**For system dashboard admin */
  getById: (clinicId: number) =>
    fetchFn<void, ClinicResDTO>(ENDPOINT.GET_CLINIC_BY_ID, "GET", undefined, [
      clinicId.toString(),
    ]),

  /**For system dashboard admin */
  getClinics: (params?: ClinicSearchReq) => {
    const query = params
      ? "?" +
        Object.entries(params)
          .filter(([_, value]) => value !== undefined && value !== null)
          .map(
            ([key, value]) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(
                value as string,
              )}`,
          )
          .join("&")
      : "";

    return fetchFn<ClinicSearchReq, Page<ClinicResDTO>>(
      `${ENDPOINT.GET_ALL_CLINICS}${query}`,
      "GET",
    );
  },

  /**For system dashboard admin */
  delete: (clinicId: number) =>
    fetchFn<void, void>(ENDPOINT.DELETE_CLINIC, "DELETE", undefined, [
      clinicId.toString(),
    ]),

  /**For system dashboard admin */
  updateLimits: (clinicId: number, limits: ClinicLimitsReqDTO) =>
    fetchFn<ClinicLimitsReqDTO, ClinicLimitsResDTO>(
      ENDPOINT.UPDATE_CLINIC_LIMITS,
      "PUT",
      limits,
      [clinicId.toString()],
    ),

  /** For Clients */
  getUserClinic: () =>
    fetchFn<void, ClinicResDTO>(ENDPOINT.GET_USER_CLINIC, "GET"),

  /** For Clients */
  update: (clinic: ClinicReqDTO) =>
    fetchFn<ClinicReqDTO, ClinicResDTO>(ENDPOINT.UPDATE_CLINIC, "PUT", clinic),

  // Settings endpoints
  /** For Clients */
  getSettings: () => {
    return fetchFn<void, ClinicSettingsResDTO>(
      ENDPOINT.GET_CURRENT_CLINIC_SETTINGS,
      "GET",
    );
  },

  /** For Clients */
  updateSettings: (settings: ClinicSettingsReqDTO) =>
    fetchFn<ClinicSettingsReqDTO, ClinicSettingsResDTO>(
      ENDPOINT.UPDATE_CURRENT_CLINIC_SETTINGS,
      "PUT",
      settings,
    ),

  /** For Clients */
  getCurrLimits: () =>
    fetchFn<void, ClinicLimitsResDTO>(
      ENDPOINT.GET_CURRENT_CLINIC_LIMITS,
      "GET",
    ),

  getClinicLimits: (clinicId: number) =>
    fetchFn<void, ClinicLimitsResDTO>(
      ENDPOINT.GET_CLINIC_LIMITS_BY_ID,
      "GET",
      undefined,
      [clinicId.toString()],
    ),

  createWithOwner: (req: ClinicWithOwnerReq) =>
    fetchFn<ClinicWithOwnerReq, ClinicWithOwnerRes>(
      ENDPOINT.CREATE_CLINIC_WITH_OWNER,
      "POST",
      req,
    ),

  getClinicUsage: (clinicId: number) =>
    fetchFn<void, ClinicUsageRes>(ENDPOINT.GET_CLINIC_USAGE, "GET", undefined, [
      clinicId.toString(),
    ]),
};
