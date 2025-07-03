// hooks/useCreateClinicWithOwner.ts
import { useMutation } from "@tanstack/react-query";
import {
  ClinicReqDTO,
  ClinicResDTO,
  UserReqDTO,
  ClinicLimitsReqDTO,
} from "../dto";
import { ClinicApi } from "../apis";
import { ApiError } from "../fetch/ApiError";
import { UserRole } from "../types/types";
import { useUpdateClinicLimits } from "./useClinic";
import { useCreateOwner } from "./useUser";

export const useCreateClinicWithOwner = () => {
  const createClinicMutation = useMutation<
    ClinicResDTO,
    ApiError,
    ClinicReqDTO
  >(ClinicApi.create);

  const updateLimitsMutation = useUpdateClinicLimits();
  const createUserMutation = useCreateOwner();

  const createClinicWithOwner = async (
    clinicData: ClinicReqDTO,
    limitsData: ClinicLimitsReqDTO,
    ownerData: Omit<UserReqDTO, "clinicId">,
  ) => {
    // Step 1: Create clinic
    const clinic = await createClinicMutation.mutateAsync(clinicData);

    try {
      // Step 2: Set clinic limits
      await updateLimitsMutation.mutateAsync({
        clinicId: clinic.id,
        limits: limitsData,
      });

      // Step 3: Create owner
      const owner = await createUserMutation.mutateAsync({
        owner: {
          ...ownerData,
          role: UserRole.OWNER,
        },
        clinicId: clinic.id,
      });

      return { clinic, owner, limits: limitsData };
    } catch (error) {
      // Rollback clinic creation if subsequent steps fail
      await ClinicApi.delete(clinic.id);
      throw error;
    }
  };

  const error = {
    ...createClinicMutation.error,
    ...updateLimitsMutation.error,
    ...createUserMutation.error,
  };

  return {
    createClinicWithOwner,
    isLoading:
      createClinicMutation.isLoading ||
      updateLimitsMutation.isLoading ||
      createUserMutation.isLoading,
    error,
  };
};
