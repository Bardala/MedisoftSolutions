import {
  CreateMedicineReq,
  CreatePatientReq,
  CreatePatientRes,
  CreatePaymentReq,
  CreatePaymentRes,
  CreateUserReq,
  CreateUserRes,
  CreateVisitMedicineReq,
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
  MonthlyDayInfo,
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
  UpdateMedicineReq,
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
import { Medicine, QueueEntry, VisitMedicine } from "../types/types";
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

export const DailyNewPatientsApi = (date) =>
  fetchFn<DailyNewPatientsReq, DailyNewPatientsRes>(
    `${ENDPOINT.DAILY_NEW_PATIENTS}?date=${date}`,
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

export const WorkDayVisitApi = (date) =>
  fetchFn<WorkdayVisitsReq, WorkdayVisitsRes>(
    `${ENDPOINT.GET_WORKDAY_VISITS}?date=${date}`,
  );

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

export const WorkdayPaymentsApi = (date) =>
  fetchFn<WorkdayPaymentsReq, WorkdayPaymentsRes>(
    `${ENDPOINT.GET_WORKDAY_PAYMENTS}?date=${date}`,
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
export const GetMonthlySummaryApi = (year: number, month: number) =>
  fetchFn<MonthlySummaryReq, MonthlySummaryRes>(
    `${ENDPOINT.GET_MONTHLY_SUMMARY}?year=${year}&month=${month}`,
  );

export const GetMonthlyDaysInfoApi = (year: number, month: number) =>
  fetchFn<void, MonthlyDayInfo[]>(
    `${ENDPOINT.GET_MONTHLY_DAYS_INFO}?year=${year}&month=${month}`,
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

// *VisitMedicine APIs

// Fetch all VisitMedicines
export const GetAllVisitMedicinesApi = () =>
  fetchFn<void, VisitMedicine[]>(ENDPOINT.GET_ALL_VISIT_MEDICINES);

// Fetch a specific VisitMedicine by ID
export const GetVisitMedicineByIdApi = (id: number) =>
  fetchFn<void, VisitMedicine>(
    ENDPOINT.GET_VISIT_MEDICINE_BY_ID,
    "GET",
    undefined,
    [id.toString()],
  );

// Create a new VisitMedicine
export const CreateVisitMedicineApi = (visitMedicine: CreateVisitMedicineReq) =>
  fetchFn<VisitMedicine, VisitMedicine>(
    ENDPOINT.CREATE_VISIT_MEDICINE,
    "POST",
    visitMedicine,
  );

// Delete a VisitMedicine by ID
export const DeleteVisitMedicineApi = (visitMedicine: VisitMedicine) =>
  fetchFn<void, void>(ENDPOINT.DELETE_VISIT_MEDICINE, "DELETE", undefined, [
    visitMedicine?.id.toString(),
  ]);

// Fetch VisitMedicines by Visit ID
export const GetVisitMedicinesByVisitIdApi = (visitId: number) =>
  fetchFn<void, VisitMedicine[]>(
    ENDPOINT.GET_VISIT_MEDICINES_BY_VISIT_ID,
    "GET",
    undefined,
    [visitId.toString()],
  );

// Fetch VisitMedicines by Medicine ID
export const GetVisitMedicinesByMedicineIdApi = (medicineId: number) =>
  fetchFn<void, VisitMedicine[]>(
    ENDPOINT.GET_VISIT_MEDICINES_BY_MEDICINE_ID,
    "GET",
    undefined,
    [medicineId.toString()],
  );

// *Medicine APIs

// Fetch all Medicines
export const GetAllMedicinesApi = () =>
  fetchFn<void, Medicine[]>(ENDPOINT.GET_ALL_MEDICINES);

// Fetch a specific Medicine by ID
export const GetMedicineByIdApi = (id: number) =>
  fetchFn<void, Medicine>(ENDPOINT.GET_MEDICINE_BY_ID, "GET", undefined, [
    id.toString(),
  ]);

// Create a new Medicine
export const CreateMedicineApi = (medicine: CreateMedicineReq) =>
  fetchFn<Medicine, Medicine>(ENDPOINT.CREATE_MEDICINE, "POST", medicine);

// Update a Medicine by ID
export const UpdateMedicineApi = (medicine: UpdateMedicineReq) =>
  fetchFn<Medicine, Medicine>(ENDPOINT.UPDATE_MEDICINE, "PUT", medicine);

// Delete a Medicine by ID
export const DeleteMedicineApi = (id: number) =>
  fetchFn<void, void>(ENDPOINT.DELETE_MEDICINE, "DELETE", undefined, [
    id.toString(),
  ]);
