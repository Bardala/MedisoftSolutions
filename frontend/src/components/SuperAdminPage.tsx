// import { ClinicDetails } from "./ClinicDetails";
// import { ClinicsList } from "./ClinicsList";
// import { CreateClinic } from "./CreateClinic";
// import { UpdateClinicLimits } from "./UpdateClinicLimits";
// import { useState } from "react";
// import { useLogin } from "../context/loginContext";
// import { User } from "../types";
// import Sidebar from "./Sidebar";

// export const SuperAdminPage = () => {
//   const { loggedInUser } = useLogin();
//   const [selectedView, setSelectedView] = useState("/admin-clinics");

//   const renderView = () => {
//     switch (selectedView) {
//       case "/admin-clinics":
//         return <ClinicsList setSelectedView={setSelectedView} />;
//       case "/admin-create-clinic":
//         return <CreateClinic />;
//       case "/admin-clinic-details":
//         return <ClinicDetails />;
//       case "/admin-update-limits":
//         return <UpdateClinicLimits />;
//       default:
//         return <ClinicsList setSelectedView={setSelectedView} />;
//     }
//   };

//   return (
//     <div className="super-admin-page">
//       <Sidebar
//         loggedInUser={loggedInUser as User}
//         setSelectedOption={setSelectedView}
//       />
//       <div className="super-admin-content">
//         <h2>System Admin Dashboard</h2>
//         {renderView()}
//       </div>
//     </div>
//   );
// };
