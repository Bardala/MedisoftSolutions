/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-empty-interface */
import {
  Procedure,
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

export type CurrUserinfoRes = User | null;

export type GetAllPatientsRes = Patient[];

export interface CreateVisitReq {
  patient: Pick<Patient, "id">;
  doctor: Pick<User, "id">;
  assistant?: Pick<User, "id">;
  doctorNotes: string;
}

export interface CreatePaymentReq {
  amount: number;
  patient: Pick<Patient, "id">;
  recordedBy: Pick<User, "id">;
}

export interface CreateVisitPaymentReq {
  visit: Pick<Visit, "id">;
  payment: Pick<Payment, "id">;
}

export type GetAllProcedureRes = Procedure[];

export interface recordVisitDentalProcedureReq {
  visit: Pick<Visit, "id">;
  dentalProcedure: Pick<Procedure, "id">;
}

export interface PatientRegistryRes {
  patient: Patient;
  visits: Visit[];
  payments: Payment[];
  visitDentalProcedure: VisitDentalProcedure[];
  visitPayments: VisitPayment[];
  visitMedicines: VisitMedicine[];
}

export interface WorkdayVisitsRes {
  workdayVisits: Visit[];
}

export interface WorkdayPaymentsRes {
  workdayPayments: Payment[];
}

// export interface WorkdayPaymentsSummaryRes {
//   paymentNum: number;
//   paymentCalc: number;
// }

export interface DailyNewPatientsRes {
  patients: Patient[];
}

export interface MonthlySummaryRes {
  totalNewPatients: number;
  totalVisits: number;
  totalRevenue: number;
  mostCrowdedDay: string;
  mostCommonProcedure: string;
}

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

export interface GetFilesRes {
  id: number;
  fileType: string;
  description: string;
  filePath: string;
}

export interface ResetPasswordReq {
  username: string;
  newPassword: string;
}

export interface GetVisitPaymentsRes {
  visitPayments: VisitPayment[];
}

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

export interface CreateMedicineRes {
  medicine: Medicine;
}

export interface DeleteMedicineRes {
  message: string;
}

export interface GetAllMedicinesRes {
  medicines: Medicine[];
}
