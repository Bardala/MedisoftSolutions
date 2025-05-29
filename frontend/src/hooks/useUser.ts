import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserReqDTO, UserResDTO } from "../dto";
import { ApiError } from "../fetch/ApiError";
import { UserApi } from "../apis";

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

  const updateUserMutation = useMutation<UserResDTO, ApiError, UserReqDTO>(
    (updatedUser) => UserApi.update(updatedUser),
    { onSuccess: () => queryClient.invalidateQueries(["patients"]) },
  );

  return {
    updateUserMutation,
  };
};
