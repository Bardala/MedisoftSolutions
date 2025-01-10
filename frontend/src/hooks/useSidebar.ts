import {
  faUser,
  faUsers,
  faClipboardList,
  faFileAlt,
  faCalendarAlt,
  faCog,
  faPlusCircle,
  faList,
  faDollarSign,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";
import { MenuItem, User } from "../types";

export const useSidebar = (loggedInUser: User) => {
  const menuItems: MenuItem[] =
    loggedInUser.role === "Doctor"
      ? [
          { label: "Current Patient", link: "/patient-profile", icon: faUser },
          { label: "Patient Records", link: "/patients", icon: faUsers },
          {
            label: "Registry",
            link: "/patient-history",
            icon: faClipboardList,
          },
          { label: "Daily Reports", link: "/reports", icon: faFileAlt },
          {
            label: "Monthly Reports",
            link: "/monthly-reports",
            icon: faCalendarAlt,
          },
          { label: "Settings", link: "/settings", icon: faCog },
        ]
      : [
          {
            label: "Add New Patient",
            link: "/add-patient",
            icon: faPlusCircle,
          },
          { label: "View Patient List", link: "/patient-list", icon: faList },
          {
            label: "Registry",
            link: "/patient-history",
            icon: faClipboardList,
          },
          { label: "Record Payments", link: "/payments", icon: faDollarSign },
          {
            label: "Daily Financial Report",
            link: "/reports",
            icon: faFileAlt,
          },
          { label: "Manage Roles", link: "/roles", icon: faUserShield },
        ];

  return { menuItems };
};
