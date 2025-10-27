import { LOCALS, useLogin } from "@/app";
import { GetAllUsersApi } from "@/core";
import { UserResDTO } from "@/dto";
import { ApiError, isDoctorRole, isAssistantRole } from "@/shared";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useState } from "react";

export const useFetchDoctors = () => {
  const fetchDoctorsQuery = useQuery<UserResDTO[], ApiError>(
    ["allDoctors"],
    async () => {
      const users = await GetAllUsersApi();
      return users.filter((user) => isDoctorRole(user.role));
    },
    {
      onSuccess: (data) => {
        localStorage.setItem(
          LOCALS.SELECTED_DOCTOR_ID,
          String(data[0]?.id || ""),
        );
      },
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

export const useSelectDoctor = () => {
  const { loggedInUser } = useLogin();
  const queryClient = useQueryClient();

  const getSelectedDoctorId = () => {
    if (isDoctorRole(loggedInUser.role)) {
      return Number(loggedInUser.id);
    }
    return Number(localStorage.getItem("selectedDoctorId"));
  };

  const [selectedDoctorId, _setSelectedDoctorId] =
    useState(getSelectedDoctorId);

  const setSelectedDoctorId = (id: number) => {
    if (isAssistantRole(loggedInUser.role)) {
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
    if (isDoctorRole(loggedInUser.role)) {
      return Number(loggedInUser.id);
    }
    return Number(localStorage.getItem("selectedDoctorId"));
  });

  // Update function that syncs with localStorage and React Query cache
  const setSelectedDoctorId = (id: number) => {
    if (isAssistantRole(loggedInUser.role)) {
      localStorage.setItem("selectedDoctorId", String(id));
    }
    queryClient.setQueryData(["selectedDoctorId"], id);
  };

  return { selectedDoctorId, setSelectedDoctorId };
};
