import { useQuery } from "@tanstack/react-query";
import { ApiError } from "../fetch/ApiError";
import { PatientApi } from "../apis";
import { PatientRegistryRes } from "../dto";

export const usePatientRegistry = (patientId: number) => {
  const patientRegistryQuery = useQuery<PatientRegistryRes, ApiError>(
    ["patient-registry", patientId],
    () => PatientApi.getRegistry(patientId),
    { enabled: !!patientId },
  );

  return { patientRegistryQuery };
};
