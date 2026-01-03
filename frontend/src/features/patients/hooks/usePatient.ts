import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useEffect, useState } from "react";

import { useReducer } from "react";
import {
  CreatePatientApi,
  DeletePatientApi,
  GetAllPatientsApi,
  PatientSearchApi,
  PatientApi,
  GetTotalStorageUsageApi,
} from "@/core/api";
import {
  PageRes,
  PatientRegistryRes,
  PatientReqDTO,
  PatientResDTO,
} from "@/dto";
import {
  Patient,
  ApiError,
  PatientSearchParams,
  PatientStatistics,
} from "@/shared";

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
  clinicId: undefined,
};

export const useCreatePatient = () => {
  const [success, setSuccess] = useState(false);
  const queryClient = useQueryClient();
  const [state, dispatch] = useReducer(patientReducer, initialPatientState);

  const createPatientMutation = useMutation<
    PatientResDTO,
    ApiError,
    PatientReqDTO
  >(CreatePatientApi(state), {
    onSuccess: (data) => {
      queryClient.setQueryData<PatientReqDTO[]>(
        ["patients", data.id],
        (currPatients = []) => [...currPatients, data],
      );
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
  const queryClient = useQueryClient();

  return useMutation<
    PatientResDTO,
    ApiError,
    { newInfo: PatientReqDTO; patientId: number }
  >((variables) => PatientApi.update(variables.newInfo, variables.patientId), {
    onSuccess: (updatedPatient) => {
      queryClient.setQueriesData<PatientRegistryRes>(
        { queryKey: ["patient-registry", updatedPatient.id] },
        (oldData) =>
          oldData ? { ...oldData, patient: updatedPatient } : oldData,
      );
    },
  });
};

export const useDeletePatient = () => {
  const deletePatientMutation = useMutation<void, ApiError, number>(
    (patientId) => DeletePatientApi(patientId),
  );

  return { deletePatientMutation };
};

export const useGetAllPatients = () => {
  const {
    data: patients,
    isLoading,
    error,
  } = useQuery(["patients"], GetAllPatientsApi);

  return {
    isLoading,
    error,
    allPatients: patients,
  };
};

export const usePatientSearch = () => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchParams, setSearchParams] = useState<PatientSearchParams>({});
  const [debouncedSearchParams, setDebouncedSearchParams] =
    useState<PatientSearchParams>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [showAllPatients, setShowAllPatients] = useState(false);

  // Debounce search params
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchParams(searchParams);
      setPage(0); // reset page on new search
    }, 300);

    return () => clearTimeout(handler);
  }, [searchParams]);

  const queryEnabled =
    showAllPatients ||
    Object.values(debouncedSearchParams).some(
      (param) => param !== undefined && param !== null && param !== "",
    );

  const pageQuery = useQuery<PageRes<PatientResDTO>, ApiError>(
    ["patients", "search", debouncedSearchParams, page, showAllPatients],
    () => PatientSearchApi(debouncedSearchParams, page),
    {
      enabled: queryEnabled,
      keepPreviousData: true,
      staleTime: 5000,
    },
  );

  const { data: searchResponse, isLoading, error, isPreviousData } = pageQuery;

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setSearchTerm("");
    setPage(0);
  };

  const handleNextPage = () => {
    if (
      !isPreviousData &&
      searchResponse &&
      page < searchResponse.totalPages - 1
    ) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    setPage((prev) => Math.max(prev - 1, 0));
  };

  return {
    ...pageQuery,
    patients: searchResponse?.content || [],
    selectedPatient,
    searchParams,
    setSearchParams,
    setSearchTerm,
    searchTerm,
    handlePatientSelect,
    setShowAllPatients,
    isLoading,
    error,
    pagination: {
      currentPage: page,
      totalPages: searchResponse?.totalPages || 0,
      totalResults: searchResponse?.totalElements || 0,
      handleNextPage,
      handlePrevPage,
      setPage,
      hasMore: searchResponse ? page < searchResponse.totalPages - 1 : false,
    },
    totalResults: searchResponse?.totalElements || 0,
  };
};

export const useGetPatientBatch = (ids: number[]) => {
  const patientsBatchQuery = useQuery<PatientResDTO[], ApiError>(
    ["patients", "batch", ids],
    () => PatientApi.getBatch(ids),
    { enabled: ids.length > 0 },
  );

  return {
    data: patientsBatchQuery.data,
    isError: patientsBatchQuery.isError,
    isLoading: patientsBatchQuery.isLoading,
    error: patientsBatchQuery.error,
  };
};

export const useGetPatient = (patientId: number) => {
  const query = useQuery<PatientResDTO, ApiError>(
    ["patients", patientId],
    () => PatientApi.Get(patientId),
    { enabled: !!patientId },
  );

  return {
    patientRes: query.data,
    error: query.error,
    isLoading: query.isLoading,
    isError: query.isError,
  };
};

export const useGetDailyPatients = (date: string) => {
  const dailyNewPatientsQuery = useQuery<PatientResDTO[], ApiError>(
    ["patients", "daily new", date],
    () => PatientApi.getDaily(date),
    {
      enabled: !!date,
    },
  );

  return {
    dailyNewPatientsQuery,
    isLoading: dailyNewPatientsQuery.isLoading,
    isError: dailyNewPatientsQuery.isError,
  };
};

export const useGetPatientStatistics = () => {
  const query = useQuery<PatientStatistics, ApiError>(
    ["patients", "statistics"],
    () => PatientApi.getStatistics(),
  );

  return {
    statistics: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};

export const usePatientFileStorageUsage = (clinicId: number) => {
  return useQuery(
    ["storageUsage", clinicId],
    () => GetTotalStorageUsageApi(clinicId),
    {
      select: (response) => response, // Extract the data from ApiRes
      enabled: !!clinicId, // Only run query when clinicId is available
    },
  );
};
