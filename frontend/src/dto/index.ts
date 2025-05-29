// Base types

import { Pageable, QueueStatus } from "../types";

// type Nullable<T> = T | null;
// type Date = Date | string; // Depending on how you handle dates

export interface LoginRes {
  token: string;
  username: string;
}

export interface LoginReq {
  identifier: string;
  password: string;
}

// Enums
// export enum QueueStatus {
//   WAITING = "WAITING",
//   IN_PROGRESS = "IN_PROGRESS",
//   COMPLETED = "COMPLETED",
// }

export enum UserRole {
  ADMIN = "Admin",
  DOCTOR = "Doctor",
  ASSISTANT = "Assistant",
}

// DTO Types
export interface MedicineResDTO {
  id: number;
  clinicId: number;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: number;
  instructions?: string;
  createdAt?: Date;
}

export interface MedicineReqDTO {
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: number;
  instructions?: string;
}

export interface MonthlyDayInfo {
  date: Date;
  totalVisits: number;
  totalRevenue: number;
  mostProcedure: string;
}

export interface MonthlySummary {
  totalNewPatients: number;
  totalVisits: number;
  totalRevenue: number;
  mostCommonProcedure: string;
  mostCrowdedDay: string;
}

export interface PatientRegistryRes {
  patient: PatientResDTO;
  visits: VisitResDTO[];
  payments: PaymentResDTO[];
  visitDentalProcedure: VisitProcedureResDTO[];
  visitPayments: VisitPaymentResDTO[];
  visitMedicines: VisitMedicineResDTO[];
}

export interface PatientReqDTO {
  fullName: string;
  phone: string;
  dateOfBirth?: string;
  medicalHistory?: string;
  age?: number;
  address?: string;
  notes?: string;
}

export interface PatientResDTO {
  id: number;
  clinicId: number;
  fullName: string;
  age?: number;
  notes?: string;
  phone: string;
  address?: string;
  medicalHistory?: string;
  createdAt?: Date;
}

export interface PaymentReqDTO {
  amount: number;
  patientId: number;
  recordedById: number;
}

export interface PaymentResDTO {
  id: number;
  clinicId: number;
  amount: number;

  // Patient info
  patientId: number;
  patientName: string;
  patientPhone: string;

  // Recorded by info
  recordedById: number;
  recordedByName: string;

  createdAt?: Date;
}
export interface WorkdayPaymentsSummaryRes {
  paymentNum: number;
  paymentCalc: number;
}

export interface ProcedureReqDTO {
  serviceName: string;
  arabicName: string;
  description?: string;
  cost: number;
}

export interface ProcedureResDTO {
  id: number;
  clinicId: number;
  serviceName: string;
  arabicName: string;
  description?: string;
  cost: number;
}

export interface QueueReqDTO {
  patientId: number;
  doctorId: number;
  assistantId?: number;
}

export interface QueueResDTO {
  id: number;
  clinicId: number;

  // Patient info
  patientId: number;
  patientName: string;

  // Doctor info
  doctorId: number;
  doctorName: string;

  // Assistant info
  assistantId?: number;
  assistantName?: string;

  position: number;
  status: QueueStatus;
  estimatedWaitTime?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserReqDTO {
  username: string;
  password: string;
  name: string;
  phone: string;
  role: UserRole;
  profilePicture?: string;
}

export interface UserResDTO {
  id: number;
  clinicId: number;
  username: string;
  name: string;
  phone: string;
  role: UserRole;
  profilePicture?: string;
  createdAt?: Date;
}

export interface VisitDetails {
  visit: VisitResDTO;
  dentalProcedures: VisitProcedureResDTO[];
  medicines: VisitMedicineResDTO[];
  payments: VisitPaymentResDTO[];
}

export interface VisitReqDTO {
  patientId: number;
  doctorId: number;
  assistantId?: number;
  waitTime?: number;
  duration?: number;
  doctorNotes?: string;
}

export interface VisitResDTO {
  id: number;
  patientId: number;
  patientName: string;
  patientPhone: string;
  clinicId: number;

  // Doctor info
  doctorId: number;
  doctorName: string;

  // Assistant info
  assistantId?: number;
  assistantName?: string;

  waitTime?: number;
  duration?: number;
  doctorNotes?: string;
  createdAt?: Date;
}

export interface VisitMedicineReqDTO {
  visitId: number;
  medicineId: number;
}

export interface VisitMedicineResDTO {
  id: number;
  visitId: number;
  patientName: string;

  // Medicine info
  medicineId: number;
  medicineName: string;
  medicineDosage: string;
  medicineFrequency: string;
  medicineDuration: number;
  medicineInstruction?: string;

  clinicId: number;
}

export interface VisitPaymentReqDTO {
  visitId: number;
  paymentId: number;
}

export interface VisitPaymentResDTO {
  id: number;
  visitId: number;

  // Payment info
  paymentId: number;
  paymentAmount: number;

  // Patient info
  patientName: string;
  patientPhone: string;

  // Recorded by info
  recordedById: number;
  recordedByName: string;

  createdAt?: Date;
  clinicId: number;
}

export interface VisitProcedureReqDTO {
  visitId: number;
  procedureId: number;
}

export interface VisitProcedureResDTO {
  id: number;
  visitId: number;

  // Procedure info
  procedureId: number;
  procedureName: string;
  procedureArabicName: string;
  procedureDescription?: string;
  procedureCost: number;

  clinicId: number;
}

export interface MonthlySummaryRes {
  totalNewPatients: number;
  totalVisits: number;
  totalRevenue: number;
  mostCrowdedDay: string;
  mostCommonProcedure: string;
}

// Utility types for API responses
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}

export interface PageRes<T> {
  content: T[];
  pageable: Pageable;
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

// types.ts
export interface ClinicReqDTO {
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
  logoUrl?: string;
  workingHours?: string;
}

export interface ClinicResDTO {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
  logoUrl?: string;
  workingHours?: string;
  phoneSupportsWhatsapp?: boolean;
}

export interface ClinicSettingsReqDTO {
  doctorName: string;
  doctorTitle: string;
  doctorQualification?: string;
  language: string;
  backupEnabled: boolean;
  backupFrequencyCron?: string;
  healingMessage?: string;
  printFooterNotes?: string;
}

export interface ClinicSettingsResDTO {
  id: number;
  doctorName: string;
  doctorTitle: string;
  doctorQualification?: string;
  language: string;
  backupEnabled: boolean;
  backupFrequencyCron?: string;
  healingMessage?: string;
  printFooterNotes?: string;
}

export interface ClinicLimitsReqDTO {
  maxUsers: number;
  maxFileStorageMb: number;
  maxPatientRecords: number;
  allowFileUpload: boolean;
  allowMultipleBranches: boolean;
  allowBillingFeature: boolean;
}

export interface ClinicLimitsResDTO {
  id: number;
  maxUsers: number;
  maxFileStorageMb: number;
  maxPatientRecords: number;
  allowFileUpload: boolean;
  allowMultipleBranches: boolean;
  allowBillingFeature: boolean;
}
