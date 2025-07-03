import { useState } from "react";
import { User } from "../types";
import AddPatient from "../components/AddPatient";
import RecordPayments from "../components/RecordPayments";
import DailyFinancialReport from "../components/DailyFinancialReport";

import PatientProfile from "../components/CurrentPatient";
import Home from "../components/Home";
import Settings from "../components/Settings";
import MonthlyDoctorReports from "../components/MonthlyDoctorReports";
import AddUserForm from "../components/AddUserForm";
import { AddVisit } from "../components/AddVisit";
import { GetRegistry } from "../components/GetRegistry";
import QueuePage from "../components/Queue";
import { ClinicSettings } from "../components/ClinicSettings";
import { EditUserInfo } from "../components/EditUserInfo";
import { ClinicsList } from "../components/ClinicsList";
import { CreateClinic } from "../components/CreateClinic";
import { CreateClinicWithOwner } from "../components/CreateClinicWithOwner";

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
    "/add-assistant": <AddUserForm />,
    "/clinic-settings": <ClinicSettings />,
  };

  const superAdminRoutes = {
    "/admin-clinics": <ClinicsList setSelectedOption={setSelectedOption} />,
    "/create-clinic": <CreateClinicWithOwner />,
    "/settings": <Settings setSelectedOption={setSelectedOption} />,
  };

  const renderContent = () => {
    if (loggedInUser.role === "SuperAdmin") {
      return (
        superAdminRoutes[selectedOption] ?? (
          <ClinicsList setSelectedOption={setSelectedOption} />
        )
      );
    }

    if (commonRoutes[selectedOption]) return commonRoutes[selectedOption];

    if (loggedInUser.role === "Doctor" && doctorRoutes[selectedOption])
      return doctorRoutes[selectedOption];

    return <Home setSelectedOption={setSelectedOption} />;
  };

  return { renderContent, selectedOption, setSelectedOption };
};
