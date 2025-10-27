import { QueueResDTO, QueueReqDTO } from "@/dto";
import { QueueStatus } from "@/shared";
import { fetchFn } from "../http-client/fetchFn";

export const FetchQueueApi = (doctorId: number) =>
  fetchFn<undefined, QueueResDTO[]>(
    `/queue/doctor/:doctorId`,
    "GET",
    undefined,
    [doctorId + ""],
  );
// Works Well

export const AddToQueueApi = (req: {
  doctorId: number;
  patientId: number;
  assistantId?: number;
}) => fetchFn<QueueReqDTO, QueueResDTO>(`/queue`, "POST", req);

export const UpdateQueueStatusApi = ({
  queueId,
  status,
}: {
  queueId: number;
  status: QueueStatus;
}) =>
  fetchFn<QueueStatus, QueueResDTO>(`/queue/:queueId/status`, "PUT", status, [
    queueId + "",
  ]);

export const UpdateQueuePositionApi = ({
  queueId,
  newPosition,
}: {
  queueId: number;
  newPosition: number;
}) =>
  fetchFn<number, QueueResDTO>("/queue/:queueId/position", "PUT", newPosition, [
    queueId + "",
  ]);

export const RemovePatientFromQueueApi = (params: { queueId: number }) =>
  fetchFn("/queue/:queueId", "DELETE", undefined, [params.queueId + ""]);

export const QueueApi = {
  CheckPatient: (patientId: number) =>
    fetchFn<void, boolean>("/queue/:patientId/checkIn", "GET", undefined, [
      patientId + "",
    ]),

  GetEntries: (doctorId: number) =>
    fetchFn<undefined, QueueResDTO[]>(
      `/queue/doctor/:doctorId`,
      "GET",
      undefined,
      [doctorId + ""],
    ),

  GetByPosition: (doctorId: number, position: number) =>
    fetchFn<void, QueueResDTO>(
      `/queue/doctor/:doctorId/queue/:position`,
      "GET",
      undefined,
      [doctorId + "", position + ""],
    ),

  AddPatient: (req: {
    doctorId: number;
    patientId: number;
    assistantId?: number;
  }) => fetchFn<QueueReqDTO, QueueResDTO>(`/queue`, "POST", req),

  UpdateStatus: ({
    queueId,
    status,
  }: {
    queueId: number;
    status: QueueStatus;
  }) =>
    fetchFn<QueueStatus, QueueResDTO>(`/queue/:queueId/status`, "PUT", status, [
      queueId + "",
    ]),

  UpdatePosition: ({
    queueId,
    newPosition,
  }: {
    queueId: number;
    newPosition: number;
  }) =>
    fetchFn<number, QueueResDTO>(
      "/queue/:queueId/position",
      "PUT",
      newPosition,
      [queueId + ""],
    ),

  RemovePatient: (params: { queueId: number }) =>
    fetchFn("/queue/:queueId", "DELETE", undefined, [params.queueId + ""]),
};
