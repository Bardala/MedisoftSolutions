import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import AddPatient from "../components/AddPatient";
import PatientList from "../components/PatientList";
import ManageRoles from "../components/ManageRoles";
import RecordPayments from "../components/RecordPayments";
import FinancialReports from "../components/FinancialComponents";

import PatientProfile from "../components/PatientProfile";
import Reports from "../components/Reports";
import Settings from "../components/Settings";

const HomePage = ({ loggedInUser }) => {
  const [selectedOption, setSelectedOption] = useState("");

  const dentistPatient = {
    name: "Jane Smith",
    phone: "987-654-3210",
    medicalHistory: "Allergic to penicillin, Asthma",
    procedures: "Teeth cleaning, Root canal treatment",
    payments: "Pending",
    lastVisit: "2024-12-15",
    notes:
      "Patient experiences anxiety during dental procedures. Recommended to use nitrous oxide for relaxation.",
  };

  const renderContent =
    loggedInUser === "Doctor"
      ? () => {
          switch (selectedOption) {
            case "/patients":
              return <PatientList />;
            case "/reports":
              return <Reports />;
            case "/settings":
              return <Settings />;
            case "/patient-profile":
              return <PatientProfile patient={dentistPatient} />;
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
            case "/reports":
              return <FinancialReports />;
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
