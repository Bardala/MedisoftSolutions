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
import { doctorId } from "../utils";

export const useHomePage = (loggedInUser: User) => {
  const [selectedOption, setSelectedOption] = useState("");

  const commonRoutes = {
    "/": <Home setSelectedOption={setSelectedOption} />,
    "/record-new-visit": <AddVisit />,
    "/patients": <QueuePage doctorId={doctorId} />,
    "/reports": <DailyFinancialReport />,
    "/settings": <Settings setSelectedOption={setSelectedOption} />,
    "/patient-history": <GetRegistry />,
    "/patient-profile": <PatientProfile />,
    "/add-patient": <AddPatient />,
    "/payments": <RecordPayments />,
  };

  const doctorRoutes = {
    "/monthly-reports": <MonthlyDoctorReports />,
    "/add-assistant": <AddAssistant />,
  };

  const renderContent = () =>
    commonRoutes[selectedOption] ??
    (loggedInUser.role === "Doctor" ? doctorRoutes[selectedOption] : null) ?? (
      <Home setSelectedOption={setSelectedOption} />
    );

  return { renderContent, selectedOption, setSelectedOption };
};
