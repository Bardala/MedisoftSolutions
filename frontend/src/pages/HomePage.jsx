import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import AddPatient from "../components/AddPatient";
import PatientList from "../components/PatientList";
import ManageRoles from "../components/ManageRoles";
import RecordPayments from "../components/RecordPayments";
import DailyFinancialReport from "../components/DailyFinancialReport";

import PatientProfile from "../components/PatientProfile";
import Home from "../components/Home";
import DailyDentistReport from "../components/DailyDentistReport";
import Settings from "../components/Settings";
import MonthlyDoctorReports from "../components/MonthlyDoctorReports";
import { patientsHistory, patients } from "../db/patientDb";
import Registry from "../components/Registry";

const HomePage = ({ loggedInUser }) => {
  const [selectedOption, setSelectedOption] = useState("");

  const renderContent =
    loggedInUser === "Doctor"
      ? () => {
          switch (selectedOption) {
            case "/":
              return <Home />;
            case "/patients":
              return <PatientList />;
            case "/reports":
              return <DailyDentistReport />;
            case "/settings":
              return <Settings />;
            case "/patient-history":
              return <Registry patient={patientsHistory} />;
            case "/patient-profile":
              return <PatientProfile patient={patients[0]} />;
            case "/monthly-reports":
              return <MonthlyDoctorReports />;
            default:
              return <Home />;
          }
        }
      : () => {
          switch (selectedOption) {
            case "/":
              return <Home />;
            case "/add-patient":
              return <AddPatient />;
            case "/patient-list":
              return <PatientList />;
            case "/roles":
              return <ManageRoles />;
            case "/payments":
              return <RecordPayments />;
            case "/patient-history":
              return <Registry patient={patientsHistory} />;
            case "/reports":
              return <DailyFinancialReport />;
            default:
              return <Home />;
          }
        };

  return (
    <div>
      {loggedInUser && (
        <Header username={loggedInUser} setSelectedOption={setSelectedOption} />
      )}
      <Sidebar
        loggedInUser={loggedInUser}
        setSelectedOption={setSelectedOption}
      />
      <div className="home-page-container">
        <div className="dashboard">
          <div className="home-content">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
