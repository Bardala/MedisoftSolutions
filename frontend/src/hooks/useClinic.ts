import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  ClinicReqDTO,
  ClinicResDTO,
  ClinicSettingsReqDTO,
  ClinicSettingsResDTO,
  ClinicLimitsResDTO,
  ClinicLimitsReqDTO,
} from "../dto";
import { ClinicApi } from "../apis";
import { ApiError } from "../fetch/ApiError";

/**For system dashboard admin */
export const useGetAllClinics = () =>
  useQuery<ClinicResDTO[], ApiError>(["clinics"], () => ClinicApi.getAll(), {
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

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
    () => ClinicApi.getLimits(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes cache
    },
  );
};

export const useUpdateClinicLimits = () => {
  return useMutation<
    ClinicLimitsResDTO,
    ApiError,
    { clinicId: number; limits: ClinicLimitsReqDTO }
  >(({ clinicId, limits }) => ClinicApi.updateLimits(clinicId, limits));
};
