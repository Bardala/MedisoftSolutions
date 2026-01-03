import { Header, Sidebar } from "@/app";
import Settings from "@/app/components/Layout/Settings";
import { AppRoutes } from "@/app/constants";
import { RecordPayments } from "@/features/billing";

import {
  AddPatient,
  CurrentPatientProfile,
  PatientPage,
} from "@/features/patients";
import GetRegistry from "@/features/patients/components/GetRegistry";
import { QueuePage } from "@/features/queue";

import { AddVisit } from "@/features/visits";
import { AppointmentsCalendar } from "@/features/visits/components/AppointmentCalender";
import {
  HomePageProps,
  isDoctorRole,
  isOwnerRole,
  isSuperAdminRole,
  User,
} from "@/shared";
import { FC, ReactNode } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import DailyFinancialReport from "@/features/reports/components/DailyFinancialReport";
import MonthlyDoctorReports from "@/features/reports/components/MonthlyDoctorReports";
import AddUserForm from "@/features/clinic-management/components/AddUserForm";
import ClinicData from "@/features/clinic-management/components/ClinicData";
import ClinicSettings from "@/features/clinic-management/components/ClinicSettings";
import ClinicsList from "@/features/clinic-management/components/ClinicsList";
import CreateClinicWithOwner from "@/features/clinic-management/components/CreateClinicWithOwner";
import EditUserInfo from "@/features/clinic-management/components/EditUserInfo";

const commonRoutes = [
  { path: AppRoutes.Dashboard, element: <Home /> },
  { path: AppRoutes.RECORD_VISIT, element: <AddVisit /> },
  { path: AppRoutes.PATIENTS, element: <QueuePage /> },
  { path: AppRoutes.REPORTS, element: <DailyFinancialReport /> },
  { path: AppRoutes.SETTINGS, element: <Settings /> },
  { path: AppRoutes.PATIENT_HISTORY, element: <GetRegistry /> },
  { path: AppRoutes.PATIENT_PROFILE, element: <CurrentPatientProfile /> },
  { path: AppRoutes.ADD_PATIENT, element: <AddPatient /> },
  { path: AppRoutes.PAYMENTS, element: <RecordPayments /> },
  { path: AppRoutes.UPDATE_USER_INFO, element: <EditUserInfo /> },
  { path: AppRoutes.PATIENT_PAGE, element: <PatientPage /> },
  { path: AppRoutes.APPOINTMENT_CALENDER, element: <AppointmentsCalendar /> },
];

const doctorRoutes = [
  { path: AppRoutes.MONTHLY_REPORTS, element: <MonthlyDoctorReports /> },
];

const ownerRoutes = (clinicId: number) => [
  { path: AppRoutes.ADD_ASSISTANT, element: <AddUserForm /> },
  { path: AppRoutes.CLINIC_SETTINGS, element: <ClinicSettings /> },
  {
    path: AppRoutes.CLINIC_DATA,
    element: <ClinicData clinicId={clinicId} />,
  },
  { path: AppRoutes.MONTHLY_REPORTS, element: <MonthlyDoctorReports /> },
];

const superAdminRoutes = [
  { path: AppRoutes.ADMIN_CLINICS, element: <ClinicsList /> },
  { path: AppRoutes.CREATE_CLINIC, element: <CreateClinicWithOwner /> },
];

interface AuthLayoutProps {
  user: User;
  children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ user, children }) => (
  <div className="content-wrapper">
    <div className={`content with-sidebar`}>
      <Header loggedInUser={user} />
      <Sidebar loggedInUser={user} />
      <div className="home-page-container">
        <div className="dashboard">
          <div className="home-content">{children}</div>
        </div>
      </div>
    </div>
  </div>
);

// todo: Rename this component
const HomePage: FC<HomePageProps> = ({ loggedInUser }) => {
  if (!loggedInUser) return null;

  const CommonRoutes = commonRoutes.map(({ path, element }) => (
    <Route key={path} path={path} element={element} />
  ));
  const OwnerRoutes =
    isOwnerRole(loggedInUser.role) &&
    ownerRoutes(loggedInUser.clinicId).map(({ path, element }) => (
      <Route key={path} path={path} element={element} />
    ));
  const DoctorRoutes =
    isDoctorRole(loggedInUser.role) &&
    doctorRoutes.map(({ path, element }) => (
      <Route key={path} path={path} element={element} />
    ));
  const SuperAdminRoutes =
    isSuperAdminRole(loggedInUser.role) &&
    superAdminRoutes.map(({ path, element }) => (
      <Route key={path} path={path} element={element} />
    ));

  return (
    <AuthLayout user={loggedInUser}>
      <Routes>
        {CommonRoutes}
        {OwnerRoutes}
        {DoctorRoutes}
        {SuperAdminRoutes}
      </Routes>
    </AuthLayout>
  );
};

export default HomePage;
