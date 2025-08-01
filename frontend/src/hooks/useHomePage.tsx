// import { useState } from "react";
// import { isOwnerRole, isSuperAdminRole, User } from "../types";
// import AddPatient from "../components/AddPatient";
// import RecordPayments from "../components/RecordPayments";
// import DailyFinancialReport from "../components/DailyFinancialReport";

// import PatientProfile from "../components/CurrentPatient";
// import Home from "../components/Home";
// import Settings from "../components/Settings";
// import MonthlyDoctorReports from "../components/MonthlyDoctorReports";
// import AddUserForm from "../components/AddUserForm";
// import { AddVisit } from "../components/AddVisit";
// import { GetRegistry } from "../components/GetRegistry";
// import QueuePage from "../components/Queue";
// import { ClinicSettings } from "../components/ClinicSettings";
// import { EditUserInfo } from "../components/EditUserInfo";
// import { ClinicsList } from "../components/ClinicsList";
// import { CreateClinicWithOwner } from "../components/CreateClinicWithOwner";
// import { ClinicData } from "../components/ClinicData";

// export const useHomePage = (loggedInUser: User) => {
//   const [selectedOption, setSelectedOption] = useState("");

//   const commonRoutes = {
//     "/": <Home />,
//     "/record-new-visit": <AddVisit />,
//     "/patients": <QueuePage />,
//     "/reports": <DailyFinancialReport />,
//     "/settings": <Settings />,
//     "/patient-history": <GetRegistry />,
//     "/patient-profile": <PatientProfile />,
//     "/add-patient": <AddPatient />,
//     "/payments": <RecordPayments />,
//     "/update-user-info": <EditUserInfo />,
//   };

//   const ownerRoutes = {
//     "/monthly-reports": <MonthlyDoctorReports />,
//     "/add-assistant": <AddUserForm />,
//     "/clinic-settings": <ClinicSettings />,
//     "/clinic-data": <ClinicData clinicId={loggedInUser.clinicId} />,
//   };

//   const superAdminRoutes = {
//     "/admin-clinics": <ClinicsList />,
//     "/create-clinic": <CreateClinicWithOwner />,
//     "/settings": <Settings />,
//     "/update-user-info": <EditUserInfo />,
//   };

//   const renderContent = () => {
//     if (isSuperAdminRole(loggedInUser.role)) {
//       return superAdminRoutes[selectedOption] ?? <ClinicsList />;
//     }

//     if (commonRoutes[selectedOption]) return commonRoutes[selectedOption];

//     if (isOwnerRole(loggedInUser.role) && ownerRoutes[selectedOption])
//       return ownerRoutes[selectedOption];

//     return <Home />;
//   };

//   return { renderContent, selectedOption, setSelectedOption };
// };
