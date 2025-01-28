import { useState } from "react";
import { User } from "../types";
import AddPatient from "../components/AddPatient";
import RecordPayments from "../components/RecordPayments";
import DailyFinancialReport from "../components/DailyFinancialReport";

import PatientProfile from "../components/PatientProfile";
import Home from "../components/Home";
import Settings from "../components/Settings";
import MonthlyDoctorReports from "../components/MonthlyDoctorReports";
import AddAssistant from "../components/AddAssistant";
import { AddVisit } from "../components/AddVisit";
import { GetRegistry } from "../components/GetRegistry";
import QueuePage from "../components/Queue";

// todo: create a context provider
export const useHomePage = (loggedInUser: User) => {
  const [selectedOption, setSelectedOption] = useState("");

  const renderContent =
    loggedInUser.role === "Doctor"
      ? () => {
          switch (selectedOption) {
            case "/":
              return <Home setSelectedOption={setSelectedOption} />;
            case "/record-new-visit":
              return <AddVisit />;
            case "/patients":
              return <QueuePage doctorId={1} />;
            case "/reports":
              return <DailyFinancialReport />;
            case "/settings":
              return <Settings setSelectedOption={setSelectedOption} />;
            case "/patient-history":
              return <GetRegistry />;
            case "/patient-profile":
              return <PatientProfile />;
            case "/monthly-reports": // Just for doctor
              return <MonthlyDoctorReports />;
            case "/add-assistant":
              return <AddAssistant />; // Just for doctor
            case "/add-patient":
              return <AddPatient />;
            case "/payments":
              return <RecordPayments />;
            default:
              return <Home setSelectedOption={setSelectedOption} />;
          }
        }
      : () => {
          switch (selectedOption) {
            case "/patient-profile":
              return <PatientProfile />;
            case "/":
              return <Home setSelectedOption={setSelectedOption} />;
            case "/add-patient":
              return <AddPatient />;
            case "/record-new-visit":
              return <AddVisit />;
            case "/patients":
              return <QueuePage doctorId={1} />;
            case "/payments":
              return <RecordPayments />;
            case "/patient-history":
              // return <Registry />;
              return <GetRegistry />;
            case "/reports":
              return <DailyFinancialReport />;
            case "/settings":
              return <Settings setSelectedOption={setSelectedOption} />;
            default:
              return <Home setSelectedOption={setSelectedOption} />;
          }
        };

  return { renderContent, selectedOption, setSelectedOption };
};
