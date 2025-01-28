import {
  CreatePatientReq,
  CreatePatientRes,
  CreatePaymentReq,
  CreatePaymentRes,
  CreateUserReq,
  CreateUserRes,
  CreateVisitPaymentReq,
  CreateVisitPaymentRes,
  CreateVisitReq,
  CreateVisitRes,
  CurrUserinfoReq,
  CurrUserinfoRes,
  DailyNewPatientsReq,
  DailyNewPatientsRes,
  DeleteFileReq,
  DeleteFileRes,
  DeleteFilesReq,
  DeleteFilesRes,
  DeletePatientReq,
  DeletePaymentReq,
  DeletePaymentRes,
  DeleteVisitReq,
  DeleteVisitRes,
  GetAllDentalProcedureReq,
  GetAllDentalProcedureRes,
  GetAllPatientsReq,
  GetAllPatientsRes,
  GetFilesReq,
  GetFilesRes,
  GetVisitPaymentsReq,
  GetVisitPaymentsRes,
  GetVisitProceduresByVisitIdReq,
  GetVisitProceduresByVisitIdRes,
  LoginReq,
  LoginRes,
  MonthlyDaysInfoReq,
  MonthlyDaysInfoRes,
  MonthlySummaryReq,
  MonthlySummaryRes,
  Patient,
  PatientRegistryReq,
  PatientRegistryRes,
  Payment,
  QueueStatus,
  recordVisitDentalProcedureReq,
  recordVisitDentalProcedureRes,
  ResetPasswordReq,
  ResetPasswordRes,
  UpdatePatientReq,
  UpdatePatientRes,
  UpdatePaymentReq,
  UpdatePaymentRes,
  UpdateUserReq,
  UpdateUserRes,
  UpdateVisitDentalProcedureReq,
  UpdateVisitDentalProcedureRes,
  UpdateVisitReq,
  UpdateVisitRes,
  UploadFileReq,
  UploadFileRes,
  User,
  Visit,
  WorkdayPaymentsReq,
  WorkdayPaymentsRes,
  WorkdayPaymentsSummaryReq,
  WorkdayPaymentsSummaryRes,
  WorkdayVisitsReq,
  WorkdayVisitsRes,
} from "../types";
import { QueueEntry } from "../types/types";
import { ENDPOINT } from "./endpoints";
import { fetchFn } from "./index";

// *auth & user
export const loginApi = (identifier: string, password: string) =>
  fetchFn<LoginReq, LoginRes>(ENDPOINT.LOGIN, "POST", { identifier, password });

export const CurrUserinfoApi = () =>
  fetchFn<CurrUserinfoReq, CurrUserinfoRes>(ENDPOINT.CURR_USER_INFO);

export const GetAllUsersApi = () => fetchFn(ENDPOINT.GET_ALL_USERS);

export const CreateUserApi = (userInfo: CreateUserReq) => () =>
  fetchFn<CreateUserReq, CreateUserRes>(ENDPOINT.CREATE_USER, "POST", userInfo);

export const UpdateUserApi = (updatedUser: User) =>
  fetchFn<UpdateUserReq, UpdateUserRes>(
    ENDPOINT.UPDATE_USER,
    "PUT",
    updatedUser,
  );

export const ResetPasswordApi = (req: ResetPasswordReq) =>
  fetchFn<ResetPasswordReq, ResetPasswordRes>(
    ENDPOINT.RESET_PASSWORD,
    "PUT",
    req,
  );

// *patient
export const CreatePatientApi = (patient: Patient) => () =>
  fetchFn<CreatePatientReq, CreatePatientRes>(
    ENDPOINT.CREATE_PATIENT,
    "POST",
    patient,
  );

export const PatientRegistryApi = (patientId: number) =>
  fetchFn<PatientRegistryReq, PatientRegistryRes>(
    ENDPOINT.PATIENT_REGISTRY,
    "GET",
    null,
    [patientId.toString()],
  );

export const GetAllPatients = () =>
  fetchFn<GetAllPatientsReq, GetAllPatientsRes>(ENDPOINT.GET_ALL_PATIENTS);

export const DailyNewPatients = () =>
  fetchFn<DailyNewPatientsReq, DailyNewPatientsRes>(
    ENDPOINT.DAILY_NEW_PATIENTS,
  );

export const UpdatePatientApi = (patient: Patient) =>
  fetchFn<UpdatePatientReq, UpdatePatientRes>(
    ENDPOINT.UPDATE_PATIENT,
    "PUT",
    patient,
  );

export const DeletePatientApi = (patientId: number) =>
  fetchFn<DeletePatientReq, DeleteFileRes>(
    ENDPOINT.DELETE_PATIENT,
    "DELETE",
    undefined,
    [patientId + ""],
  );

// *visit
export const CreateVisitApi = (visit: CreateVisitReq) =>
  fetchFn<CreateVisitReq, CreateVisitRes>(ENDPOINT.CREATE_VISIT, "POST", visit);

export const WorkDayVisitApi = () =>
  fetchFn<WorkdayVisitsReq, WorkdayVisitsRes>(ENDPOINT.GET_WORKDAY_VISITS);

export const UpdateVisitApi = (visit: Visit) =>
  fetchFn<UpdateVisitReq, UpdateVisitRes>(ENDPOINT.UPDATE_VISIT, "PUT", visit);

export const DeleteVisitApi = (visitId: number) =>
  fetchFn<DeleteVisitReq, DeleteVisitRes>(
    ENDPOINT.DELETE_VISIT,
    "DELETE",
    undefined,
    [visitId + ""],
  );

// *payment
export const CreatePaymentApi = (payment: CreatePaymentReq) =>
  fetchFn<CreatePaymentReq, CreatePaymentRes>(
    ENDPOINT.CREATE_PAYMENT,
    "POST",
    payment,
  );

export const WorkdayPaymentsApi = () =>
  fetchFn<WorkdayPaymentsReq, WorkdayPaymentsRes>(
    ENDPOINT.GET_WORKDAY_PAYMENTS,
  );

export const WorkdayPaymentsSummaryApi = () =>
  fetchFn<WorkdayPaymentsSummaryReq, WorkdayPaymentsSummaryRes>(
    ENDPOINT.GET_WORKDAY_PAYMENTS_SUMMARY,
  );

export const UpdatePaymentApi = (payment: Payment) =>
  fetchFn<UpdatePaymentReq, UpdatePaymentRes>(
    ENDPOINT.UPDATE_PAYMENT,
    "PUT",
    payment,
  );

export const DeletePaymentApi = (payment: Payment) =>
  fetchFn<DeletePaymentReq, DeletePaymentRes>(
    ENDPOINT.DELETE_PAYMENT,
    "DELETE",
    undefined,
    [payment.id + ""],
  );

// *DentalProcedure
export const GetAllDentalProceduresApi = () =>
  fetchFn<GetAllDentalProcedureReq, GetAllDentalProcedureRes>(
    ENDPOINT.GET_ALL_DENTAL_PROCEDURES,
  );

// *VisitDentalProcedure
export const RecordVisitDentalProcedureApi = (
  visitDentalProcedure: recordVisitDentalProcedureReq,
) =>
  fetchFn<recordVisitDentalProcedureReq, recordVisitDentalProcedureRes>(
    ENDPOINT.POST_VISIT_DENTAL_PROCEDURE,
    "POST",
    visitDentalProcedure,
  );

// *VisitPayment
export const CreateVisitPaymentApi = (visitPayment: CreateVisitPaymentReq) =>
  fetchFn<CreateVisitPaymentReq, CreateVisitPaymentRes>(
    ENDPOINT.POST_VISIT_PAYMENT,
    "POST",
    visitPayment,
  );

// *Monthly Report
export const GetMonthlySummaryApi = () =>
  fetchFn<MonthlySummaryReq, MonthlySummaryRes>(ENDPOINT.GET_MONTHLY_SUMMARY);

export const GetMonthlyDaysInfoApi = () =>
  fetchFn<MonthlyDaysInfoReq, MonthlyDaysInfoRes>(
    ENDPOINT.GET_MONTHLY_DAYS_INFO,
  );

//* Files
export const UploadFileApi = (req: UploadFileReq) => {
  const formData = new FormData();
  formData.append("patientId", req.patientId);
  formData.append("fileType", req.fileType);
  formData.append("description", "N/A");
  formData.append("file", req.file);

  return fetchFn<UploadFileReq, UploadFileRes>(
    ENDPOINT.UPLOAD_PATIENT_FILE,
    "POST",
    formData,
  );
};

export const GetFilesApi = (patientId: number) =>
  fetchFn<GetFilesReq, GetFilesRes[]>(ENDPOINT.GET_FILES, "GET", undefined, [
    patientId + "",
  ]);

export const DeleteFileApi = (fileId: number) =>
  fetchFn<DeleteFileReq, DeleteFileRes>(
    ENDPOINT.DELETE_FILE,
    "DELETE",
    undefined,
    [fileId + ""],
  );

export const DeleteFilesApi = (fileId: number) =>
  fetchFn<DeleteFilesReq, DeleteFilesRes>(
    ENDPOINT.DELETE_FILES,
    "DELETE",
    undefined,
    [fileId + ""],
  );

export const GetVisitPaymentApi = (patientId: number) =>
  fetchFn<GetVisitPaymentsReq, GetVisitPaymentsRes>(
    ENDPOINT.GET_VISIT_PAYMENT,
    "GET",
    undefined,
    [patientId + ""],
  );

export const UpdateVisitDentalProcedureApi = (visitDentalProcedureId: number) =>
  fetchFn<UpdateVisitDentalProcedureReq, UpdateVisitDentalProcedureRes>(
    ENDPOINT.UPDATE_VISIT_DENTALPROCEDURE,
    "PUT",
    undefined,
    [visitDentalProcedureId + ""],
  );

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

export const DeleteVisitProcedureApi = (param: { procedureId: number }) =>
  fetchFn(ENDPOINT.DELETE_VISIT_PROCEDURE, "DELETE", undefined, [
    param.procedureId + "",
  ]);

export const GetVisitProceduresByVisitIdApi = (params: { visitId: number }) =>
  fetchFn<GetVisitProceduresByVisitIdReq, GetVisitProceduresByVisitIdRes>(
    ENDPOINT.GET_VISIT_PROCEDURES_BY_VISIT_ID,
    "GET",
    undefined,
    [params.visitId + ""],
  );
