import { useQuery } from "@tanstack/react-query";
import { PatientRegistryRes } from "../types";
import { ApiError } from "../fetch/ApiError";
import { PatientRegistryApi } from "../apis";

export const usePatientRegistry = (patientId: number) => {
  const patientRegistryQuery = useQuery<PatientRegistryRes, ApiError>(
    ["patient-registry", patientId],
    () => PatientRegistryApi(patientId),
    {
      enabled: !!patientId,
    },
  );

  return { patientRegistryQuery };
};
