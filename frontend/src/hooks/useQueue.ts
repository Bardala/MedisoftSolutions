import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import {
  FetchQueueApi,
  UpdateQueueStatusApi,
  RemovePatientFromQueueApi,
  UpdateQueuePositionApi,
} from "../apis";
import { ApiError } from "../fetch/ApiError";
import { QueueEntry, QueueStatus } from "../types";

// Fetch Queue
export const useFetchQueue = (doctorId: number) => {
  const fetchQueueQuery = useQuery<QueueEntry[], ApiError>(
    ["queue", doctorId],
    () => FetchQueueApi(doctorId),
    {
      enabled: !!doctorId,
      refetchInterval: 5000,
    },
  );

  return {
    queue: fetchQueueQuery.data,
    isError: fetchQueueQuery.isError,
    isLoading: fetchQueueQuery.isLoading,
    refetch: fetchQueueQuery.refetch,
  };
};

// Update Queue Status
export const useUpdateQueueStatus = (doctorId: number) => {
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation<
    QueueEntry,
    ApiError,
    { queueId: number; status: QueueStatus }
  >(({ queueId, status }) => UpdateQueueStatusApi({ queueId, status }), {
    onSuccess: () => {
      queryClient.invalidateQueries(["queue", doctorId]);
    },
  });

  return { updateStatusMutation };
};

// Remove Patient from Queue
export const useRemovePatientFromQueue = (doctorId: number) => {
  const queryClient = useQueryClient();

  const removePatientMutation = useMutation<
    unknown,
    ApiError,
    { queueId: number }
  >(({ queueId }) => RemovePatientFromQueueApi({ queueId }), {
    onSuccess: () => {
      queryClient.invalidateQueries(["queue", doctorId]);
    },
  });

  return { removePatientMutation };
};

// Update Queue Position
export const useUpdateQueuePosition = (doctorId: number) => {
  const queryClient = useQueryClient();

  const updatePositionMutation = useMutation<
    QueueEntry,
    ApiError,
    { queueId: number; newPosition: number }
  >(
    ({ queueId, newPosition }) =>
      UpdateQueuePositionApi({ queueId, newPosition }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["queue", doctorId]);
      },
    },
  );

  return { updatePositionMutation };
};
