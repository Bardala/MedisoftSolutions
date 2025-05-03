import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "../fetch/ApiError";
import {
  CreatePatientReq,
  CreatePatientRes,
  DeletePatientRes,
  PageRes,
  Patient,
  PatientSearchParams,
  UpdatePatientReq,
  UpdatePatientRes,
} from "../types";

import { useEffect, useState } from "react";

import { useReducer } from "react";
import {
  CreatePatientApi,
  UpdatePatientApi,
  DeletePatientApi,
  FetchQueueApi,
  GetAllPatientsApi,
  PatientSearchApi,
} from "../apis";
import { useFetchDoctors } from "./useDoctors";

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

export const useIsPatientInAnyQueue = (patientId?: number) => {
  const [isInQueue, setIsInQueue] = useState(false);
  const { doctors, isLoading: isDoctorsLoading } = useFetchDoctors();

  useEffect(() => {
    if (!patientId || !doctors || doctors.length === 0) return;

    let cancelled = false;

    const checkAllQueues = async () => {
      for (const doctor of doctors) {
        const res = await FetchQueueApi(doctor.id); // directly use the API
        if (!cancelled && res.some((entry) => entry.patient.id === patientId)) {
          setIsInQueue(true);
          return;
        }
      }
      if (!cancelled) {
        setIsInQueue(false);
      }
    };

    checkAllQueues();

    return () => {
      cancelled = true;
    };
  }, [patientId, doctors]);

  return {
    isInQueue,
    isLoading: isDoctorsLoading,
  };
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

// export const usePatientSearch = () => {
//   const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
//   const [searchParams, setSearchParams] = useState<PatientSearchParams | null>(
//     {},
//   );
//   const [searchTerm, setSearchTerm] = useState("");
//   const [page, setPage] = useState(0);
//   const [showAllPatients, setShowAllPatients] = useState(false);

//   const pageQuery = useQuery<PageRes<Patient>, ApiError>(
//     ["patients", "search", searchParams, page, showAllPatients],
//     () => {
//       // When showAllPatients is true or search params exist, make the API call
//       if (
//         showAllPatients ||
//         Object.values(searchParams).some(
//           (param) => param !== undefined && param !== null && param !== "",
//         )
//       ) {
//         return PatientSearchApi(searchParams, page);
//       }

//       return null as unknown as PageRes<Patient>;
//     },
//     {
//       keepPreviousData: true,
//       // staleTime: 5000,
//     },
//   );

//   const {
//     data: searchResponse,
//     isLoading,
//     error,
//     refetch,
//     isPreviousData, // Useful for pagination
//   } = pageQuery;

//   // Debounce the search term
//   useEffect(() => {
//     if (searchTerm.trim()) {
//       const debounceTimer = setTimeout(() => {
//         setPage(0); // Reset to first page on new search
//         refetch();
//       }, 300);

//       return () => clearTimeout(debounceTimer);
//     }
//   }, [searchTerm, refetch]);

//   const handlePatientSelect = (patient: Patient) => {
//     setSelectedPatient(patient);
//     setSearchTerm("");
//     setPage(0);
//   };

//   // Handle pagination controls
//   const handleNextPage = () => {
//     if (
//       !isPreviousData &&
//       searchResponse &&
//       page < searchResponse.totalPages - 1
//     ) {
//       setPage((prev) => prev + 1);
//     }
//   };

//   const handlePrevPage = () => {
//     setPage((prev) => Math.max(prev - 1, 0));
//   };

//   return {
//     ...pageQuery,
//     patients: pageQuery.data?.content || [],
//     selectedPatient,
//     searchParams,
//     setSearchParams,
//     handlePatientSelect,
//     isLoading,
//     error,
//     setShowAllPatients,
//     pagination: {
//       currentPage: page,
//       totalPages: pageQuery.data?.totalPages || 0,
//       totalResults: searchResponse?.totalElements || 0,
//       handleNextPage,
//       handlePrevPage,
//       setPage,
//       hasMore: pageQuery.data ? page < pageQuery.data.totalPages - 1 : false,
//     },
//     totalResults: searchResponse?.totalElements || 0,
//   };
// };

/**Slightly Best Performance */
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

  const pageQuery = useQuery<PageRes<Patient>, ApiError>(
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

  console.log("patients", searchResponse?.content);

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
