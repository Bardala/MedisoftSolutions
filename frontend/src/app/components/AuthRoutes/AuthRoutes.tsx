import { AppRoutes } from "@/app/constants";
import {
  ProtectedRoute,
  WithClinicStaffProtection,
  WithSuperAdminProtection,
  WithOwnerProtection,
} from "@/core/hoc";
import { RecordPayments } from "@/features/billing";
import AddUserForm from "@/features/clinic-management/components/AddUserForm";
import ClinicData from "@/features/clinic-management/components/ClinicData";
import ClinicSettings from "@/features/clinic-management/components/ClinicSettings";
import ClinicsList from "@/features/clinic-management/components/ClinicsList";
import CreateClinicWithOwner from "@/features/clinic-management/components/CreateClinicWithOwner";
import EditUserInfo from "@/features/clinic-management/components/EditUserInfo";
import { Home } from "@/features/dashboard";
import {
  CurrentPatientProfile,
  AddPatient,
  PatientPage,
} from "@/features/patients";
import GetRegistry from "@/features/patients/components/GetRegistry";
import { QueuePage } from "@/features/queue";
import DailyFinancialReport from "@/features/reports/components/DailyFinancialReport";
import MonthlyDoctorReports from "@/features/reports/components/MonthlyDoctorReports";
import { AddVisit } from "@/features/visits";
import { AppointmentsCalendar } from "@/features/visits/components/AppointmentCalender";
import { User, UserRole, CLINIC_STAFF_ROLES } from "@/shared";
import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import Settings from "../Layout/Settings";

interface IRoute {
  path: string;
  element: JSX.Element;
}

export const AuthRoutes: FC<{ user: User }> = ({ user }) => {
  const CommonRoutes: IRoute[] = [
    { path: AppRoutes.SETTINGS, element: <Settings /> },
  ];

  const ClinicStaffRoutes: IRoute[] = [
    { path: AppRoutes.Dashboard, element: <Home /> },
    { path: AppRoutes.RECORD_VISIT, element: <AddVisit /> },
    { path: AppRoutes.PATIENTS, element: <QueuePage /> },
    { path: AppRoutes.REPORTS, element: <DailyFinancialReport /> },
    { path: AppRoutes.PATIENT_PROFILE, element: <CurrentPatientProfile /> },
    { path: AppRoutes.ADD_PATIENT, element: <AddPatient /> },
    { path: AppRoutes.PAYMENTS, element: <RecordPayments /> },
    { path: AppRoutes.UPDATE_USER_INFO, element: <EditUserInfo /> },
    {
      path: AppRoutes.APPOINTMENT_CALENDER,
      element: <AppointmentsCalendar />,
    },
  ];

  const OwnerAssistantRoutes: IRoute[] = [
    { path: AppRoutes.PATIENT_HISTORY, element: <GetRegistry /> },
    { path: AppRoutes.PATIENT_PAGE, element: <PatientPage /> },
  ];

  const OwnerRoutes: IRoute[] = [
    { path: AppRoutes.ADD_ASSISTANT, element: <AddUserForm /> },
    { path: AppRoutes.CLINIC_SETTINGS, element: <ClinicSettings /> },
    {
      path: AppRoutes.CLINIC_DATA,
      element: <ClinicData clinicId={user.clinicId} />,
    },
  ];

  const OwnerDoctorRoutes: IRoute[] = [
    { path: AppRoutes.MONTHLY_REPORTS, element: <MonthlyDoctorReports /> },
  ];

  const SuperAdminRoutes: IRoute[] = [
    { path: AppRoutes.ADMIN_CLINICS, element: <ClinicsList /> },
    { path: AppRoutes.CREATE_CLINIC, element: <CreateClinicWithOwner /> },
  ];

  const ProtectedCommonRoutes = CommonRoutes.map((r) => (
    <Route
      key={r.path}
      path={r.path}
      element={ProtectedRoute({
        user,
        allowedRoles: [UserRole.SUPER_ADMIN, ...CLINIC_STAFF_ROLES],
        children: r.element,
      })}
    />
  ));

  const ProtectedClinicStaffRoutes = ClinicStaffRoutes.map((r) => (
    <Route
      key={r.path}
      path={r.path}
      element={WithClinicStaffProtection({ user, children: r.element })}
    />
  ));
  const ProtectedSuperAdminRoutes = SuperAdminRoutes.map((r) => (
    <Route
      key={r.path}
      path={r.path}
      element={WithSuperAdminProtection({ user, children: r.element })}
    />
  ));
  const ProtectedOwnerDoctorRoutes = OwnerDoctorRoutes.map((r) => (
    <Route
      key={r.path}
      path={r.path}
      element={ProtectedRoute({
        user,
        children: r.element,
        allowedRoles: [UserRole.OWNER, UserRole.DOCTOR],
      })}
    />
  ));
  const ProtectedOwnerAssistantRoutes = OwnerAssistantRoutes.map((r) => (
    <Route
      key={r.path}
      path={r.path}
      element={ProtectedRoute({
        user,
        children: r.element,
        allowedRoles: [UserRole.OWNER, UserRole.ASSISTANT],
        redirectTo: AppRoutes.Dashboard, // todo: change to current path.
      })}
    />
  ));
  const ProtectedOwnerRoutes = OwnerRoutes.map((r) => (
    <Route
      key={r.path}
      path={r.path}
      element={WithOwnerProtection({ user, children: r.element })}
    />
  ));

  return (
    <Routes>
      {ProtectedCommonRoutes}
      {ProtectedClinicStaffRoutes}
      {ProtectedSuperAdminRoutes}
      {ProtectedOwnerDoctorRoutes}
      {ProtectedOwnerAssistantRoutes}
      {ProtectedOwnerRoutes}
    </Routes>
  );
};
