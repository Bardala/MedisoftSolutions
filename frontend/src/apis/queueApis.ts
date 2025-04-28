import { fetchFn } from "../fetch";
import { QueueEntry, QueueStatus } from "../types";

// Works Well
export const FetchQueueApi = (doctorId: number) =>
  fetchFn<undefined, QueueEntry[]>(
    `/queue/doctor/:doctorId`,
    "GET",
    undefined,
    [doctorId + ""],
  );
// Works Well

export const AddToQueueApi = (req: { doctorId: number; patientId: number }) =>
  fetchFn(`/queue`, "POST", req);
// Works Well

export const UpdateQueueStatusApi = ({
  queueId,
  status,
}: {
  queueId: number;
  status: QueueStatus;
}) =>
  fetchFn<QueueStatus, QueueEntry>(`/queue/:queueId/status`, "PUT", status, [
    queueId + "",
  ]);

export const UpdateQueuePositionApi = ({
  queueId,
  newPosition,
}: {
  queueId: number;
  newPosition: number;
}) =>
  fetchFn<number, QueueEntry>("/queue/:queueId/position", "PUT", newPosition, [
    queueId + "",
  ]);

export const RemovePatientFromQueueApi = (params: { queueId: number }) =>
  fetchFn("/queue/:queueId", "DELETE", undefined, [params.queueId + ""]);
