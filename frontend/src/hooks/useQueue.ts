import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import {
  FetchQueueApi,
  UpdateQueueStatusApi,
  RemovePatientFromQueueApi,
  UpdateQueuePositionApi,
} from "../fetch/api";
import { ApiError } from "../fetch/ApiError";
import { QueueEntry, QueueStatus } from "../types";

export const useQueue = (doctorId: number) => {
  const queryClient = useQueryClient();

  const {
    data: queue,
    isLoading,
    isError,
  } = useQuery<QueueEntry[], ApiError>(
    ["queue", doctorId],
    () => FetchQueueApi(doctorId),
    {
      enabled: !!doctorId,
      refetchInterval: 5000,
    },
  );

  const updateStatusMutation = useMutation<
    QueueEntry,
    ApiError,
    { queueId: number; status: QueueStatus }
  >(({ queueId, status }) => UpdateQueueStatusApi({ queueId, status }), {
    onSuccess: () => queryClient.invalidateQueries(["queue", doctorId]),
  });

  const removePatientMutation = useMutation(RemovePatientFromQueueApi, {
    onSuccess: () => queryClient.invalidateQueries(["queue", doctorId]),
  });

  const updatePositionMutation = useMutation<
    QueueEntry,
    ApiError,
    { queueId: number; newPosition: number }
  >(
    ({ queueId, newPosition }) =>
      UpdateQueuePositionApi({ queueId, newPosition }),
    {
      onSuccess: () => queryClient.invalidateQueries(["queue", doctorId]),
    },
  );

  return {
    updatePositionMutation,
    removePatientMutation,
    updateStatusMutation,
    queue,
    isLoading,
    isError,
  };
};
