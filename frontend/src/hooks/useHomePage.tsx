import { useState } from "react";
import { User } from "../types";
import AddPatient from "../components/AddPatient";
import RecordPayments from "../components/RecordPayments";
import DailyFinancialReport from "../components/DailyFinancialReport";

import PatientProfile from "../components/CurrentPatient";
import Home from "../components/Home";
import Settings from "../components/Settings";
import MonthlyDoctorReports from "../components/MonthlyDoctorReports";
import AddAssistant from "../components/AddAssistant";
import { AddVisit } from "../components/AddVisit";
import { GetRegistry } from "../components/GetRegistry";
import QueuePage from "../components/Queue";
import { ClinicSettings } from "../components/ClinicSettings";
import { EditUserInfo } from "../components/EditUserInfo";

export const useHomePage = (loggedInUser: User) => {
  const [selectedOption, setSelectedOption] = useState("");

  const commonRoutes = {
    "/": <Home setSelectedOption={setSelectedOption} />,
    "/record-new-visit": <AddVisit />,
    "/patients": <QueuePage />,
    "/reports": <DailyFinancialReport />,
    "/settings": <Settings setSelectedOption={setSelectedOption} />,
    "/patient-history": <GetRegistry />,
    "/patient-profile": <PatientProfile />,
    "/add-patient": <AddPatient />,
    "/payments": <RecordPayments />,
    "/update-user-info": <EditUserInfo />,
  };

  const doctorRoutes = {
    "/monthly-reports": <MonthlyDoctorReports />,
    "/add-assistant": <AddAssistant />,
    "/clinic-settings": <ClinicSettings />,
  };

  const renderContent = () =>
    commonRoutes[selectedOption] ??
    (loggedInUser.role === "Doctor" ? doctorRoutes[selectedOption] : null) ?? (
      <Home setSelectedOption={setSelectedOption} />
    );

  return { renderContent, selectedOption, setSelectedOption };
};
