/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-empty-interface */
import {
  DentalProcedure,
  Medicine,
  Patient,
  Payment,
  User,
  Visit,
  VisitDentalProcedure,
  VisitMedicine,
  VisitPayment,
} from "./";

export interface LoginRes {
  token: string;
  username: string;
}

export interface LoginReq {
  identifier: string;
  password: string;
}

export interface LoginProviderProps {
  children: React.ReactNode;
}

export type CreateUserReq = Omit<User, "id">;
export type CreateUserRes = Required<LoginRes>;

export interface CurrUserinfoReq {}
export type CurrUserinfoRes = User | null;

export interface CreatePatientReq extends Patient {}
export interface CreatePatientRes extends Patient {}

export interface GetAllPatientsReq {}
export type GetAllPatientsRes = Patient[];

export interface CreateVisitReq {
  patient: Pick<Patient, "id">;
  doctor: Pick<User, "id">;
  assistant?: Pick<User, "id">;
  doctorNotes: string;
}
export interface CreateVisitRes extends Visit {}

export interface CreatePaymentReq {
  amount: number;
  patient: Pick<Patient, "id">;
  recordedBy: Pick<User, "id">;
}
export interface CreatePaymentRes extends Payment {}

export interface CreateVisitPaymentReq {
  visit: Pick<Visit, "id">;
  payment: Pick<Payment, "id">;
}
export interface CreateVisitPaymentRes extends VisitPayment {}

export interface CreateDentalProcedureReq extends DentalProcedure {}
export interface CreateDentalProcedureRes extends DentalProcedure {}

export type GetAllDentalProcedureReq = {};
export type GetAllDentalProcedureRes = DentalProcedure[];

export interface recordVisitDentalProcedureReq {
  visit: Pick<Visit, "id">;
  dentalProcedure: Pick<DentalProcedure, "id">;
}
export interface recordVisitDentalProcedureRes extends VisitDentalProcedure {}

export interface PatientRegistryReq {}
export interface PatientRegistryRes {
  patient: Patient;
  visits: Visit[];
  payments: Payment[];
  visitDentalProcedure: VisitDentalProcedure[];
  visitPayments: VisitPayment[];
  visitMedicines: VisitMedicine[];
}

export interface WorkdayVisitsReq {}
export interface WorkdayVisitsRes {
  workdayVisits: Visit[];
}

export interface WorkdayPaymentsReq {}
export interface WorkdayPaymentsRes {
  workdayPayments: Payment[];
}

export interface WorkdayPaymentsSummaryReq {}
export interface WorkdayPaymentsSummaryRes {
  paymentNum: number;
  paymentCalc: number;
}

export interface DailyNewPatientsReq {}
export interface DailyNewPatientsRes {
  patients: Patient[];
}

export interface MonthlySummaryReq {}
export interface MonthlySummaryRes {
  totalNewPatients: number;
  totalVisits: number;
  totalRevenue: number;
  mostCrowdedDay: string;
  mostCommonProcedure: string;
}

export interface MonthlyDaysInfoReq {}
export type MonthlyDaysInfoRes = MonthlyDayInfo[];

export type MonthlyDayInfo = {
  date: Date;
  totalVisits: number;
  totalRevenue: number;
  mostProcedure: string;
};

export interface UploadFileReq {
  patientId: string;
  fileType: string;
  description: string;
  file: File;
}
export interface UploadFileRes {}

export interface GetFilesReq {} // Path variable patientId
export interface GetFilesRes {
  id: number;
  fileType: string;
  description: string;
  filePath: string;
}

export interface DeleteFileReq {} // Path variable fileId
export interface DeleteFileRes {}

export interface DeleteFilesReq {} // Path variable patientId
export interface DeleteFilesRes {}

export interface UpdateUserReq extends User {}
export interface UpdateUserRes extends User {}

export interface ResetPasswordReq {
  username: string;
  newPassword: string;
}
export interface ResetPasswordRes {}

export interface UpdatePatientReq extends Patient {}
export interface UpdatePatientRes extends Patient {}

export interface DeletePatientReq {}
export interface DeletePatientRes {}

export interface UpdateVisitReq extends Visit {}
export interface UpdateVisitRes extends Visit {}

export interface DeleteVisitReq {}
export interface DeleteVisitRes {}

export interface UpdatePaymentReq extends Payment {}
export interface UpdatePaymentRes extends Payment {}

export interface DeletePaymentReq {}
export interface DeletePaymentRes {}

export interface UpdateVisitDentalProcedureReq {} // Path variable visitDentalProcedureId
export interface UpdateVisitDentalProcedureRes extends VisitDentalProcedure {}

export interface DeleteVisitDentalProcedureReq {}
export interface DeleteVisitDentalProcedureRes {}

export interface GetVisitPaymentsReq {} // Path variable patientId
export interface GetVisitPaymentsRes {
  visitPayments: VisitPayment[];
}

export interface DeleteVisitProcedureReq {}
export interface DeleteVisitProcedureRes {}

export interface GetVisitProceduresByVisitIdReq {}
export interface GetVisitProceduresByVisitIdRes {
  visitProcedure: VisitDentalProcedure[];
}

// Define request and response types for each API (if needed)
export interface GetAllVisitMedicinesRes {
  data: VisitMedicine[];
}

export interface GetVisitMedicineByIdRes {
  data: VisitMedicine;
}

export interface CreateVisitMedicineReq {
  visit: Visit;
  medicine: Medicine;
}

export interface CreateVisitMedicineRes {
  data: VisitMedicine;
}

export interface DeleteVisitMedicineRes {
  message: string;
}

export interface GetVisitMedicinesByVisitIdRes {
  data: VisitMedicine[];
}

export interface GetVisitMedicinesByMedicineIdRes {
  data: VisitMedicine[];
}

// Define request and response types for each API
export interface CreateMedicineReq extends Medicine {}

export interface CreateMedicineRes {
  medicine: Medicine;
}

export interface UpdateMedicineReq extends Medicine {}

export interface UpdateMedicineRes extends Medicine {}

export interface DeleteMedicineRes {
  message: string;
}

export interface GetMedicineByIdRes extends Medicine {}

export interface GetAllMedicinesRes {
  medicines: Medicine[];
}
