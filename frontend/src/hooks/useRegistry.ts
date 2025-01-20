import { useMutation } from "@tanstack/react-query";
import { PatientRegistryRes } from "../types";
import { ApiError } from "../fetch/ApiError";
import { PatientRegistryApi } from "../fetch/api";

export const usePatientRegistry = () => {
  const mutation = useMutation<PatientRegistryRes, ApiError, number>(
    (patientId) => PatientRegistryApi(patientId),
  );

  return { mutation };
};
