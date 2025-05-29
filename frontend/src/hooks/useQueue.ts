import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { QueueApi } from "../apis";
import { ApiError } from "../fetch/ApiError";
import { QueueStatus } from "../types";
import { QueueResDTO } from "../dto";

export const useFetchQueue = (doctorId: number) => {
  const fetchQueueQuery = useQuery<QueueResDTO[], ApiError>(
    ["queue", doctorId],
    () => QueueApi.GetEntries(doctorId),
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
    QueueResDTO,
    ApiError,
    { queueId: number; status: QueueStatus }
  >(({ queueId, status }) => QueueApi.UpdateStatus({ queueId, status }), {
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
  >(({ queueId }) => QueueApi.RemovePatient({ queueId }), {
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
    QueueResDTO,
    ApiError,
    { queueId: number; newPosition: number }
  >(
    ({ queueId, newPosition }) =>
      QueueApi.UpdatePosition({ queueId, newPosition }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["queue", doctorId]);
      },
    },
  );

  return { updatePositionMutation };
};

export const useIsPatientInAnyQueue = (patientId: number) => {
  const isInQueueQuery = useQuery<boolean, ApiError>(
    ["queue-patients", patientId],
    () => QueueApi.CheckPatient(patientId),
    { enabled: !!patientId },
  );

  return {
    isInQueue: isInQueueQuery.data,
    isLoading: isInQueueQuery.isLoading,
  };
};

export const useGetQueueByPosition = (doctorId: number, position: number) => {
  const query = useQuery<QueueResDTO, ApiError>(
    ["queue", doctorId, "position", position],
    () => QueueApi.GetByPosition(doctorId, position),
    { enabled: !!doctorId && !!position },
  );

  return {
    queueRes: query.data,
    error: query.error,
    isError: query.isError,
    isLoading: query.isLoading,
  };
};
