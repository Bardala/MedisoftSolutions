import { UserApi } from "@/core";
import { UserResDTO, UpdateUserReqDTO, UserReqDTO } from "@/dto";
import { ApiError } from "@/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetUserBatch = (ids: number[]) => {
  const usersBatchQuery = useQuery<UserResDTO[], ApiError>(
    ["users", "batch", ids],
    () => UserApi.getBatch(ids),
    { enabled: ids.length > 0 },
  );

  return {
    data: usersBatchQuery.data,
    isError: usersBatchQuery.isError,
    isLoading: usersBatchQuery.isLoading,
    error: usersBatchQuery.error,
  };
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UserResDTO,
    ApiError,
    { updatedUser: UpdateUserReqDTO; id?: number }
  >((req) => UserApi.update(req), {
    onSuccess: (user) => {
      queryClient.invalidateQueries(["users"]);
      window.location.reload();
    },
  });
};

export const useCreateOwner = () => {
  return useMutation<
    UserResDTO,
    ApiError,
    { owner: UserReqDTO; clinicId: number }
  >(({ owner, clinicId }) => UserApi.createOwner(owner, clinicId));
};

export const useGetClinicStaff = (clinicId: number) => {
  return useQuery<UserResDTO[], ApiError>(
    ["clinicStaff", clinicId],
    () => UserApi.getClinicStaff(clinicId),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes cache
      enabled: !!clinicId,
    },
  );
};
