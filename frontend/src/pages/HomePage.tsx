import { FC } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { HomePageProps, isOwnerRole, isSuperAdminRole } from "../types";
import { Routes, Route } from "react-router-dom";
import AddPatient from "../components/AddPatient";
import AddUserForm from "../components/AddUserForm";
import { AddVisit } from "../components/AddVisit";
import { ClinicData } from "../components/ClinicData";
import { ClinicSettings } from "../components/ClinicSettings";
import { ClinicsList } from "../components/ClinicsList";
import { CreateClinicWithOwner } from "../components/CreateClinicWithOwner";
import DailyFinancialReport from "../components/DailyFinancialReport";
import { EditUserInfo } from "../components/EditUserInfo";
import GetRegistry from "../components/GetRegistry";
import Home from "../components/Home";
import MonthlyDoctorReports from "../components/MonthlyDoctorReports";
import QueuePage from "../components/Queue";
import RecordPayments from "../components/RecordPayments";
import Settings from "../components/Settings";
import PatientProfile from "../components/CurrentPatient";
import { PatientPage } from "../components/PatientPage";
import { AppRoutes } from "../constants";

const HomePage: FC<HomePageProps> = ({ loggedInUser }) => {
  return (
    <div>
      {loggedInUser && <Header loggedInUser={loggedInUser} />}
      {loggedInUser && <Sidebar loggedInUser={loggedInUser} />}

      <div className="home-page-container">
        <div className="dashboard">
          <div className="home-content">
            <Routes>
              {/* Common routes */}
              <Route path={AppRoutes.HOME} element={<Home />} />
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
                element={<PatientProfile />}
              />
              <Route path={AppRoutes.ADD_PATIENT} element={<AddPatient />} />
              <Route path={AppRoutes.PAYMENTS} element={<RecordPayments />} />
              <Route
                path={AppRoutes.UPDATE_USER_INFO}
                element={<EditUserInfo />}
              />
              <Route path={AppRoutes.PATIENT_PAGE} element={<PatientPage />} />

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
  );
};

export default HomePage;
