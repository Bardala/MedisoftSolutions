import { PatientApi } from "@/core";
import { PatientRegistryRes, ApiError } from "@/shared";
import { useQuery } from "@tanstack/react-query";

export const usePatientRegistry = (patientId: number) => {
  const patientRegistryQuery = useQuery<PatientRegistryRes, ApiError>(
    ["patient-registry", patientId],
    () => PatientApi.getRegistry(patientId),
    { enabled: !!patientId },
  );

  return { patientRegistryQuery };
};
