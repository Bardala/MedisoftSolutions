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
import { HomePageProps, isOwnerRole, isSuperAdminRole } from "@/shared";
import { FC } from "react";
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

const HomePage: FC<HomePageProps> = ({ loggedInUser }) => {
  return (
    <div className="content-wrapper">
      <div className={`content ${loggedInUser ? "with-sidebar" : ""}`}>
        {loggedInUser && <Header loggedInUser={loggedInUser} />}
        {loggedInUser && <Sidebar loggedInUser={loggedInUser} />}

        <div className="home-page-container">
          <div className="dashboard">
            <div className="home-content">
              <Routes>
                {/* Common routes */}
                <Route path={AppRoutes.Dashboard} element={<Home />} />
                <Route path={AppRoutes.RECORD_VISIT} element={<AddVisit />} />
                <Route path={AppRoutes.PATIENTS} element={<QueuePage />} />
                <Route
                  path={AppRoutes.REPORTS}
                  element={<DailyFinancialReport />}
                />
                <Route path={AppRoutes.SETTINGS} element={<Settings />} />
                <Route
                  path={AppRoutes.PATIENT_HISTORY}
                  element={<GetRegistry />}
                />
                <Route
                  path={AppRoutes.PATIENT_PROFILE}
                  element={<CurrentPatientProfile />}
                />
                <Route path={AppRoutes.ADD_PATIENT} element={<AddPatient />} />
                <Route path={AppRoutes.PAYMENTS} element={<RecordPayments />} />
                <Route
                  path={AppRoutes.UPDATE_USER_INFO}
                  element={<EditUserInfo />}
                />
                <Route
                  path={AppRoutes.PATIENT_PAGE}
                  element={<PatientPage />}
                />
                <Route
                  path={AppRoutes.APPOINTMENT_CALENDER}
                  element={<AppointmentsCalendar />}
                />
                {/* Owner-only routes */}
                {isOwnerRole(loggedInUser.role) && (
                  <>
                    <Route
                      path={AppRoutes.MONTHLY_REPORTS}
                      element={<MonthlyDoctorReports />}
                    />
                    <Route
                      path={AppRoutes.ADD_ASSISTANT}
                      element={<AddUserForm />}
                    />
                    <Route
                      path={AppRoutes.CLINIC_SETTINGS}
                      element={<ClinicSettings />}
                    />
                    <Route
                      path={AppRoutes.CLINIC_DATA}
                      element={<ClinicData clinicId={loggedInUser.clinicId} />}
                    />
                  </>
                )}
                {/* SuperAdmin-only routes */}
                {isSuperAdminRole(loggedInUser.role) && (
                  <>
                    <Route
                      path={AppRoutes.ADMIN_CLINICS}
                      element={<ClinicsList />}
                    />
                    <Route
                      path={AppRoutes.CREATE_CLINIC}
                      element={<CreateClinicWithOwner />}
                    />
                  </>
                )}
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
