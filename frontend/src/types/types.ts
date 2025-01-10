export interface LoginContextType {
  loggedInUser: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  success: boolean;
  error: string | null;
}

export interface User {
  id?: number;
  username: string;
  role: string;
  fullName: string;
  password?: string;
  phone: number;
}

export interface Patient {
  id?: number;
  fullName: string;
  dateOfBirth?: Date;
  age?: number;
  notes?: string;
  phone: number;
  address?: string;
  medicalHistory?: string;
  createdAt?: Date;
}

export interface Visit {
  id?: number;
  patient: Patient;
  visitDate?: Date;
  doctor: User;
  assistant?: User;
  wait?: number;
  duration?: number;
  doctorNotes?: string;
  createdAt?: Date;
}

export interface VisitDentalProcedure {
  id?: number;
  visit: Visit;
  service: DentalProcedure;
}

export interface DentalProcedure {
  id?: number;
  name: string;
}

export interface VisitMedicine {
  id?: number;
  visit: Visit;
  medicine: Medicine;
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

export interface VisitPayment {
  id?: number;
  visit: Visit;
  payment: Payment;
}

export interface Payment {
  id?: number;
  amount: number;
  timestamp?: Date;
  patient: Patient;
  recordedBy: User;
  date: Date;
}
