import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GetAllUsersApi } from "../fetch/api";
import { ApiError } from "../fetch/ApiError";
import { User } from "../types";
import { useState } from "react";
import { useLogin } from "../context/loginContext";
import { doctorId } from "../utils";

export const useFetchDoctors = () => {
  const fetchDoctorsQuery = useQuery<User[], ApiError>(
    ["allDoctors"],
    async () => {
      const users = await GetAllUsersApi();
      // Filter users with Doctor role
      return users.filter((user) => user.role === "Doctor");
    },
    {
      // Cache for 5 minutes
      staleTime: 300000,
      // Retry once if failed
      retry: 1,
    },
  );

  return {
    doctors: fetchDoctorsQuery.data,
    isError: fetchDoctorsQuery.isError,
    isLoading: fetchDoctorsQuery.isLoading,
    error: fetchDoctorsQuery.error,
  };
};

// hooks/useSelectDoctor.ts
export const useSelectDoctor = () => {
  const { loggedInUser } = useLogin();
  const queryClient = useQueryClient();

  const getSelectedDoctorId = () => {
    if (loggedInUser.role === "Doctor") {
      return Number(loggedInUser.id);
    }
    return Number(localStorage.getItem("selectedDoctorId")) || doctorId;
  };

  const [selectedDoctorId, _setSelectedDoctorId] =
    useState(getSelectedDoctorId);

  const setSelectedDoctorId = (id: number) => {
    if (loggedInUser.role === "Assistant") {
      localStorage.setItem("selectedDoctorId", String(id));
    }
    _setSelectedDoctorId(id);
    queryClient.setQueryData(["selectedDoctorId"], id);
  };

  return { selectedDoctorId, setSelectedDoctorId };
};

export const useDoctorSelection = () => {
  const { loggedInUser } = useLogin();
  const queryClient = useQueryClient();

  // Get the selected doctor ID
  const { data: selectedDoctorId } = useQuery(["selectedDoctorId"], () => {
    if (loggedInUser.role === "Doctor") {
      return Number(loggedInUser.id);
    }
    return Number(localStorage.getItem("selectedDoctorId")) || doctorId;
  });

  // Update function that syncs with localStorage and React Query cache
  const setSelectedDoctorId = (id: number) => {
    if (loggedInUser.role === "Assistant") {
      localStorage.setItem("selectedDoctorId", String(id));
    }
    queryClient.setQueryData(["selectedDoctorId"], id);
  };

  return { selectedDoctorId, setSelectedDoctorId };
};
