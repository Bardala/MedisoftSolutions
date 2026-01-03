import {
  PaymentResDTO,
  QueueResDTO,
  VisitMedicineResDTO,
  VisitPaymentResDTO,
  VisitProcedureResDTO,
  VisitResDTO,
} from "../../dto";
import { ApiError } from "../utils";

export interface LoginContextType {
  loggedInUser: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  success: boolean;
  error: ApiError;
}

export interface Clinic {
  id?: number;
  name: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  logoUrl?: string;
  workingHours?: string;
  phoneSupportsWhatsapp?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  doctors?: User[];
  clinicLimits?: ClinicLimits;
  clinicSettings?: ClinicSettings;
}

export interface ClinicLimits {
  id?: number;
  clinicId: number;
  maxUsers?: number;
  maxFileStorageMb?: number;
  maxPatientRecords?: number;
  allowFileUpload?: boolean;
  allowMultipleBranches?: boolean;
  allowBillingFeature?: boolean;
}

export interface ClinicSettings {
  id?: number;
  clinicId: number;
  doctorName?: string;
  doctorTitle?: string;
  doctorQualification?: string;
  backupDbPath?: string;
  backupImagesPath?: string;
  healingMessage?: string;
  printFooterNotes?: string;
  language?: string;
  backupEnabled?: boolean;
  backupFrequencyCron?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  id?: number;
  clinicId: number;
  username: string;
  password?: string;
  name: string;
  phone: string;
  role: UserRole;
  profilePicture?: string;
  createdAt?: Date;
}

export interface Patient {
  id?: number;
  clinicId: number;
  fullName: string;
  age?: number;
  notes?: string;
  phone: string;
  address?: string;
  medicalHistory?: string;
  createdAt?: Date;
}

export interface PatientFile {
  id?: number;
  clinicId: number;
  patient: Patient;
  fileType: string;
  description?: string;
  filePath?: string;
  createdAt?: Date;
}

export interface Procedure {
  id?: number;
  clinicId: number;
  serviceName: string;
  arabicName: string;
  description?: string;
  cost: number;
}

export interface Medicine {
  id: number;
  clinicId: number;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: number;
  instructions?: string;
  createdAt?: Date;
}

// export interface Payment {
//   id?: number;
//   clinicId: number;
//   amount: number;
//   patient: Patient;
//   recordedBy: User;
//   createdAt?: Date;
// }

export type Payment = PaymentResDTO;

// export interface QueueEntry {
//   id?: number;
//   clinicId: number;
//   patient: Patient;
//   doctor: User;
//   assistant?: User;
//   position: number;
//   status: "WAITING" | "IN_PROGRESS" | "COMPLETED";
//   estimatedWaitTime?: number;
//   createdAt?: Date;
//   updatedAt?: Date;
// }

export type QueueEntry = QueueResDTO;

// export interface Visit {
//   id?: number;
//   patient: Patient;
//   clinicId: number;
//   doctor: User;
//   assistant?: User;
//   wait?: number;
//   duration?: number;
//   doctorNotes?: string;
//   createdAt?: Date;
// }

export type Visit = VisitResDTO;

// export interface VisitDentalProcedure {
//   id?: number;
//   visit: Visit;
//   dentalProcedure: Procedure;
//   clinicId: number;
// }
export type VisitDentalProcedure = VisitProcedureResDTO;

// export interface VisitMedicine {
//   id?: number;
//   visit: Visit;
//   medicine: Medicine;
//   clinicId: number;
// }
export type VisitMedicine = VisitMedicineResDTO;

// export interface VisitPayment {
//   id?: number;
//   visit: Visit;
//   payment: Payment;
//   clinicId: number;
// }

export type VisitPayment = VisitPaymentResDTO;

export interface VisitAnalysis {
  visit: Visit;
  procedures: Procedure[];
  payment: Payment;
  medicines: Medicine[];
}

export interface ApiRes<T> {
  data: T;
  error: { [key: string]: string } | null;
}
export type RestMethod = "GET" | "POST" | "DELETE" | "PUT";

export type QueueStatus = "WAITING" | "IN_PROGRESS" | "COMPLETED";

// export interface Pageable {
//   pageNumber: number;
//   pageSize: number;
//   sort: {
//     empty: boolean;
//     sorted: boolean;
//     unsorted: boolean;
//   };
//   offset: number;
//   paged: boolean;
//   unpaged: boolean;
// }

export interface PatientSearchParams {
  patient?: string; // Searches both name and phone
  fullName?: string;
  phone?: string;
  address?: string;
  age?: number;
  medicalHistory?: string;
}

export interface NotificationType {
  id: string;
  message: string;
  createdAt: Date;
  type: "Patient" | "Payment" | "Visit";
}

export interface IClinicSettings {
  id?: number;
  doctorId: number;
  doctorName: string;
  doctorTitle: string;
  doctorQualification: string;

  clinicAddress: string;
  clinicPhoneNumber: string;
  clinicEmail: string;
  workingHours: string;

  backupDbPath: string;
  backupImagesPath: string;

  prescriptionLogoPath: string;
  healingMessage: string;
  printFooterNotes: string;
  language: string;

  phoneSupportsWhatsapp: boolean;

  backupEnabled: boolean;
  backupIntervalDays: number;
} // Enums
// export enum QueueStatus {
//   WAITING = "WAITING",
//   IN_PROGRESS = "IN_PROGRESS",
//   COMPLETED = "COMPLETED",
// }

export enum UserRole {
  SUPER_ADMIN = "SuperAdmin",
  DOCTOR = "Doctor",
  ASSISTANT = "Assistant",
  OWNER = "Owner",
}

export const CLINIC_STAFF_ROLES: UserRole[] = [
  UserRole.OWNER,
  UserRole.ASSISTANT,
  UserRole.DOCTOR,
];

// todo: update it to be just contains doctor role and use isDoctorOrOwnerRole where needed
const doctorLikeRoles = [UserRole.DOCTOR, UserRole.OWNER];

export function isDoctorRole(role: UserRole): boolean {
  return doctorLikeRoles.includes(role);
}

export const isDoctorOrOwnerRole = (role: UserRole): boolean =>
  role === UserRole.DOCTOR || role === UserRole.OWNER;

export const isNotDoctorRole = (role: UserRole): boolean =>
  role !== UserRole.DOCTOR;

export const isAssistantRole = (role: UserRole): boolean =>
  role === UserRole.ASSISTANT;

export const isOwnerRole = (role: UserRole): boolean => role === UserRole.OWNER;

export const isSuperAdminRole = (role: UserRole): boolean =>
  role === UserRole.SUPER_ADMIN;

export enum PlanType {
  FREE = "FREE",
  VISIT_BASED = "VISIT_BASED",
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

export enum SubscriptionStatus {
  ACTIVE = "ACTIVE",
  EXPIRED = "EXPIRED",
  CANCELLED = "CANCELLED",
}
