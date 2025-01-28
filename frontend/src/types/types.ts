import { ApiError } from "../fetch/ApiError";

export interface LoginContextType {
  loggedInUser: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  success: boolean;
  error: ApiError;
}

export interface User {
  id?: number;
  username: string;
  role: "Doctor" | "Assistant";
  name: string;
  password?: string;
  phone: string;
  createdAt?: Date;
  profilePicture?: string;
}

export interface Patient {
  id?: number;
  fullName: string;
  age?: number;
  notes?: string;
  phone: string;
  address?: string;
  medicalHistory?: string;
  createdAt?: Date;
}

export interface Visit {
  id?: number;
  patient: Patient;
  doctor: User;
  assistant?: User;
  wait?: number;
  duration?: number;
  doctorNotes?: string;
  createdAt?: Date;
}

export interface DentalProcedure {
  id?: number;
  serviceName: string;
  arabicName: string;
  description: string;
  cost: number;
}

export interface Medicine {
  id?: number;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: number;
  instructions?: string;
  createdAt?: Date;
}

export interface Payment {
  id?: number;
  amount: number;
  createdAt?: Date;
  patient: Patient;
  recordedBy: User;
}

export interface VisitDentalProcedure {
  id?: number;
  visit: Visit;
  dentalProcedure: DentalProcedure;
}

export interface VisitMedicine {
  id?: number;
  visit: Visit;
  medicine: Medicine;
}

export interface VisitPayment {
  id?: number;
  visit: Visit;
  payment: Payment;
}

// export interface VisitAnalysis {
//   visitId: number;
//   createdAt?: Date;
//   doctorName: string;
//   doctorNotes?: string;
//   procedures: { procedureId?: number; serviceName: string }[];
//   totalPayment: number;
//   paymentIds: number[]; // Array of payment IDs
//   medicines: { medicineId?: number; medicineName: string }[];
// }

export interface VisitAnalysis {
  visit: Visit;
  procedures: DentalProcedure[];
  payment: Payment;
  medicines: Medicine[];
}

export interface ApiRes<T> {
  data: T;
  error: { [key: string]: string } | null;
}
export type RestMethod = "GET" | "POST" | "DELETE" | "PUT";

export type QueueStatus = "WAITING" | "IN_PROGRESS" | "COMPLETED";

export interface QueueEntry {
  id?: number;
  position: number;
  patient: Patient;
  doctor: User;
  status: QueueStatus;
  assistant?: User;
  createdAt?: Date;
  updatedAt?: Date;
  estimatedWaitTime?: Date;
}
