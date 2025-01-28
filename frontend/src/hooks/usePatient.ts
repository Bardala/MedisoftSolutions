import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "../fetch/ApiError";
import {
  CreatePatientReq,
  CreatePatientRes,
  DeletePatientRes,
  Patient,
  UpdatePatientReq,
  UpdatePatientRes,
} from "../types";
import {
  CreatePatientApi,
  DeletePatientApi,
  UpdatePatientApi,
} from "../fetch/api";
import { useState } from "react";

import { useReducer } from "react";

type PatientAction =
  | { type: "SET_FULL_NAME"; payload: string }
  | { type: "SET_DATE_OF_BIRTH"; payload: Date }
  | { type: "SET_AGE"; payload: number }
  | { type: "SET_NOTES"; payload: string }
  | { type: "SET_PHONE"; payload: string }
  | { type: "SET_ADDRESS"; payload: string }
  | { type: "SET_MEDICAL_HISTORY"; payload: string }
  | { type: "RESET" };

const patientReducer = (state: Patient, action: PatientAction): Patient => {
  switch (action.type) {
    case "SET_FULL_NAME":
      return { ...state, fullName: action.payload };
    case "SET_AGE":
      return { ...state, age: action.payload };
    case "SET_NOTES":
      return { ...state, notes: action.payload };
    case "SET_PHONE":
      return { ...state, phone: action.payload };
    case "SET_ADDRESS":
      return { ...state, address: action.payload };
    case "SET_MEDICAL_HISTORY":
      return { ...state, medicalHistory: action.payload };
    case "RESET":
      return initialPatientState; // Reset to initial state
    default:
      return state;
  }
};

const initialPatientState: Patient = {
  fullName: "",
  phone: undefined,
  age: undefined,
  notes: "",
  address: "",
  medicalHistory: "",
};

export const useCreatePatient = () => {
  const [success, setSuccess] = useState(false);
  const queryClient = useQueryClient();
  const [state, dispatch] = useReducer(patientReducer, initialPatientState);

  const createPatientMutation = useMutation<
    CreatePatientRes,
    ApiError,
    CreatePatientReq
  >(CreatePatientApi(state), {
    onSuccess: (data) => {
      queryClient.setQueryData<Patient[]>(["patients"], (currPatients = []) => [
        ...currPatients,
        data,
      ]);
      setSuccess(true);
    },
    onError: () => {
      setSuccess(false);
    },
  });

  return {
    success,
    createPatient: createPatientMutation.mutateAsync,
    isLoading: createPatientMutation.isLoading,
    isError: createPatientMutation.isError,
    error: createPatientMutation.error,
    patient: state,
    dispatch,
  };
};

export const useUpdatePatient = () => {
  const updatePatientMutation = useMutation<
    UpdatePatientRes,
    ApiError,
    UpdatePatientReq
  >((newInfo) => UpdatePatientApi(newInfo));

  return { updatePatientMutation };
};

export const useDeletePatient = () => {
  const deletePatientMutation = useMutation<DeletePatientRes, ApiError, number>(
    (patientId) => DeletePatientApi(patientId),
  );

  return { deletePatientMutation };
};
