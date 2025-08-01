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
              <Route path="/" element={<Home />} />
              <Route path="/record-new-visit" element={<AddVisit />} />
              <Route path="/patients" element={<QueuePage />} />
              <Route path="/reports" element={<DailyFinancialReport />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/patient-history" element={<GetRegistry />} />
              <Route path="/patient-profile" element={<PatientProfile />} />
              <Route path="/add-patient" element={<AddPatient />} />
              <Route path="/payments" element={<RecordPayments />} />
              <Route path="/update-user-info" element={<EditUserInfo />} />

              {/* Owner-only routes */}
              {isOwnerRole(loggedInUser.role) && (
                <>
                  <Route
                    path="/monthly-reports"
                    element={<MonthlyDoctorReports />}
                  />
                  <Route path="/add-assistant" element={<AddUserForm />} />
                  <Route path="/clinic-settings" element={<ClinicSettings />} />
                  <Route
                    path="/clinic-data"
                    element={<ClinicData clinicId={loggedInUser.clinicId} />}
                  />
                </>
              )}

              {/* SuperAdmin-only routes */}
              {isSuperAdminRole(loggedInUser.role) && (
                <>
                  <Route path="/admin-clinics" element={<ClinicsList />} />
                  <Route
                    path="/create-clinic"
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
