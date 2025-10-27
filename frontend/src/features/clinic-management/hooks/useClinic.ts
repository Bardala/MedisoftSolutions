import { useLogin } from "@/app";
import { ClinicApi } from "@/core";
import {
  ClinicResDTO,
  ClinicReqDTO,
  ClinicSettingsResDTO,
  ClinicSettingsReqDTO,
  ClinicLimitsResDTO,
  ClinicLimitsReqDTO,
  ClinicWithOwnerRes,
  ClinicWithOwnerReq,
  ClinicUsageRes,
  ClinicBillingPlanRes,
  ClinicBillingPlanReq,
} from "@/dto";
import { ClinicSearchReq, Page, ApiError, isSuperAdminRole } from "@/shared";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/**For system dashboard admin */
export const useGetClinics = (params?: ClinicSearchReq) =>
  useQuery<Page<ClinicResDTO>, ApiError>(
    ["clinics", params], // Include params in query key
    () => ClinicApi.getClinics(params),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes cache
      keepPreviousData: true, // Smooth pagination transitions
    },
  );

/**For system dashboard admin */
export const useGetClinic = (id: number) =>
  useQuery<ClinicResDTO, ApiError>(
    ["clinic", id],
    () => ClinicApi.getById(id),
    {
      enabled: !!id,
    },
  );

/**For system dashboard admin */
export const useCreateClinic = () => {
  const queryClient = useQueryClient();

  return useMutation<ClinicResDTO, ApiError, ClinicReqDTO>(
    (clinic) => ClinicApi.create(clinic),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["clinics"]);
      },
    },
  );
};

/**For system dashboard admin */
export const useDeleteClinic = () => {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, number>((id) => ClinicApi.delete(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["clinics"]);
    },
  });
};

/** For Clients */
export const useGetCurrentClinic = () =>
  useQuery<ClinicResDTO, ApiError>(["clinic"], () => ClinicApi.getUserClinic());

/** For Clients */
export const useUpdateClinic = () => {
  const queryClient = useQueryClient();

  return useMutation<ClinicResDTO, ApiError, { data: ClinicReqDTO }>(
    ({ data }) => ClinicApi.update(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["clinic"]);
      },
    },
  );
};

/** For Clients */
export const useGetClinicSettings = () =>
  useQuery<ClinicSettingsResDTO, ApiError>(
    ["clinic-settings"],
    () => ClinicApi.getSettings(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes cache
    },
  );

/** For Clients */
export const useUpdateClinicSettings = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ClinicSettingsResDTO,
    ApiError,
    { data: ClinicSettingsReqDTO }
  >(({ data }) => ClinicApi.updateSettings(data), {
    onSuccess: () => {
      queryClient.invalidateQueries(["clinic-settings"]);
    },
  });
};

/** For Clients */
export const useGetCurrentClinicLimits = () => {
  return useQuery<ClinicLimitsResDTO, ApiError>(
    ["clinic-limits"],
    () => ClinicApi.getCurrLimits(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes cache
    },
  );
};

// hooks/useClinic.ts
export const useUpdateClinicLimits = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ClinicLimitsResDTO,
    ApiError,
    { clinicId: number; limits: ClinicLimitsReqDTO }
  >(({ clinicId, limits }) => ClinicApi.updateLimits(clinicId, limits), {
    onSuccess: (data, variables) => {
      // Update the cached clinic limits data
      queryClient.setQueryData(["clinicLimits", variables.clinicId], data);
      // Optionally invalidate other related queries
      queryClient.invalidateQueries(["clinic", variables.clinicId]);
    },
  });
};

export const useGetClinicLimits = (clinicId?: number) => {
  const { loggedInUser } = useLogin();
  return useQuery<ClinicLimitsResDTO, ApiError>(
    clinicId ? ["clinicLimits", clinicId] : ["clinic-limits"],
    () =>
      isSuperAdminRole(loggedInUser.role)
        ? ClinicApi.getClinicLimits(clinicId)
        : ClinicApi.getCurrLimits(),
    {
      staleTime: 5 * 60 * 1000,
      enabled: isSuperAdminRole(loggedInUser.role) ? !!clinicId : true,
    },
  );
};

export const useCreateClinicWithOwner = () => {
  return useMutation<ClinicWithOwnerRes, ApiError, ClinicWithOwnerReq>(
    (data: ClinicWithOwnerReq) => ClinicApi.createWithOwner(data),
  );
};

export const useGetClinicUsage = (clinicId: number) => {
  return useQuery<ClinicUsageRes, ApiError>(
    ["clinicUsage", clinicId],
    () => ClinicApi.getClinicUsage(clinicId),
    {
      staleTime: 5 * 60 * 1000,
      enabled: !!clinicId,
    },
  );
};

// src/hooks/useClinic.ts
export const useGetBillingPlan = (clinicId?: number) => {
  return useQuery<ClinicBillingPlanRes, ApiError>(
    ["billingPlan", clinicId],
    () => ClinicApi.getBillingPlan(clinicId),
    { enabled: !!clinicId },
  );
};

export const useUpdateBillingPlan = (clinicId?: number) => {
  const queryClient = useQueryClient();

  return useMutation(
    (data: ClinicBillingPlanReq) => ClinicApi.updateBillingPlan(clinicId, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["billingPlan", clinicId]);
      },
    },
  );
};
