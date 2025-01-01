import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import AddPatient from "../components/AddPatient";
import PatientList from "../components/PatientList";
import ManageRoles from "../components/ManageRoles";
import RecordPayments from "../components/RecordPayments";
import DailyFinancialReport from "../components/DailyFinancialReport";

import PatientProfile from "../components/PatientProfile";
import DailyDentistReport from "../components/DailyDentistReport";
import Settings from "../components/Settings";
import MonthlyDoctorReports from "../components/MonthlyDoctorReports";
import { patientsHistory, patients } from "../db/patientDb";
import PatientHistory from "../components/PatientHistory";

const HomePage = ({ loggedInUser }) => {
  const [selectedOption, setSelectedOption] = useState("");

  const renderContent =
    loggedInUser === "Doctor"
      ? () => {
          switch (selectedOption) {
            case "/patients":
              return <PatientList />;
            case "/reports":
              return <DailyDentistReport />;
            case "/settings":
              return <Settings />;
            case "/patient-profile":
              return <PatientProfile patient={patients[0]} />;
            case "/monthly-reports":
              return <MonthlyDoctorReports />;
            default:
              return (
                <h1 className="welcome-message">
                  Welcome to the {loggedInUser} Dashboard!
                </h1>
              );
          }
        }
      : () => {
          switch (selectedOption) {
            case "/add-patient":
              return <AddPatient />;
            case "/patient-list":
              return <PatientList />;
            case "/roles":
              return <ManageRoles />;
            case "/payments":
              return <RecordPayments />;
            case "/patient-history":
              return <PatientHistory patient={patientsHistory} />;
            case "/reports":
              return <DailyFinancialReport />;
            default:
              return (
                <h1 className="welcome-message">
                  Welcome to the {loggedInUser} Dashboard!
                </h1>
              );
          }
        };

  return (
    <div className="home-page-container">
      {loggedInUser && <Header username={loggedInUser} />}
      <div className="dashboard">
        <Sidebar
          loggedInUser={loggedInUser}
          setSelectedOption={setSelectedOption}
        />

        <div className="home-content">{renderContent()}</div>
      </div>
    </div>
  );
};

export default HomePage;
