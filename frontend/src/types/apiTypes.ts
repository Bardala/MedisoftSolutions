/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-empty-interface */
import {
  DentalProcedure,
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
  patient: Pick<Visit, "id">;
  doctor: Pick<User, "id">;
  doctorNotes: string;
  visitDate: Date;
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
