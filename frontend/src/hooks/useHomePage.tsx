import { useState } from "react";
import { User } from "../types";
import AddPatient from "../components/AddPatient";
import PatientList from "../components/PatientList";
import ManageRoles from "../components/ManageRoles";
import RecordPayments from "../components/RecordPayments";
import DailyFinancialReport from "../components/DailyFinancialReport";
import { patientsHistory, patients } from "../db/patientDb";

import PatientProfile from "../components/PatientProfile";
import Home from "../components/Home";
import DailyDentistReport from "../components/DailyDentistReport";
import Settings from "../components/Settings";
import MonthlyDoctorReports from "../components/MonthlyDoctorReports";
import Registry from "../components/Registry";
import AddAssistant from "../components/AddAssistant";

export const useHomePage = (loggedInUser: User) => {
  const [selectedOption, setSelectedOption] = useState("");

  const renderContent =
    loggedInUser.role === "Doctor"
      ? () => {
          switch (selectedOption) {
            case "/":
              return <Home setSelectedOption={setSelectedOption} />;
            case "/patients":
              return <PatientList />;
            case "/reports":
              return <DailyDentistReport />;
            case "/settings":
              return <Settings setSelectedOption={setSelectedOption} />;
            case "/patient-history":
              return <Registry patient={patientsHistory} />;
            case "/patient-profile":
              return <PatientProfile patient={patients[0]} />;
            case "/monthly-reports":
              return <MonthlyDoctorReports />;
            case "/add-assistant":
              return <AddAssistant />;
            case "/add-patient":
              return <AddPatient />;
            default:
              return <Home setSelectedOption={setSelectedOption} />;
          }
        }
      : () => {
          switch (selectedOption) {
            case "/":
              return <Home setSelectedOption={setSelectedOption} />;
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
              return <Home setSelectedOption={setSelectedOption} />;
          }
        };

  return { renderContent, selectedOption, setSelectedOption };
};
