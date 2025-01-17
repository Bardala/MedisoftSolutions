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
  name: string;
  password?: string;
  phone: number;
  createdAt?: Date;
}

export interface Patient {
  id?: number;
  fullName: string;
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
  doctor: User;
  assistant?: User;
  visitDate?: Date;
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
  createdAt?: number;
  patient: Patient;
  recordedBy: User;
  date?: Date; // todo: remove this field
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

export interface VisitAnalysis {
  id?: number;
  createdAt?: Date;
  doctorName: string;
  doctorNotes?: string;
  procedures: string[];
  totalPayment: number;
  medicines: string[];
}
