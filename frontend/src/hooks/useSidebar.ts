import {
  faUser,
  faUsers,
  faFileAlt,
  faCalendarAlt,
  faCog,
  faList,
  faSearch,
  faFileArchive,
  faProcedures,
} from "@fortawesome/free-solid-svg-icons";
import { MenuItem, User } from "../types";

export const useSidebar = (loggedInUser: User) => {
  const menuItems: MenuItem[] =
    loggedInUser.role === "Doctor"
      ? [
          {
            label: "Current Patient",
            link: "/patient-profile",
            icon: faProcedures,
          },
          { label: "Wait List", link: "/patients", icon: faUsers },
          {
            label: "Registry",
            link: "/patient-history",
            icon: faSearch,
          },
          {
            label: "Daily Reports",
            link: "/reports",
            icon: faFileArchive,
          },
          {
            label: "Monthly Reports",
            link: "/monthly-reports",
            icon: faCalendarAlt,
          },
          { label: "Settings", link: "/settings", icon: faCog },
        ]
      : [
          { label: "Current Patient", link: "/patient-profile", icon: faUser },
          { label: "Wait List", link: "/patients", icon: faList },
          {
            label: "Registry",
            link: "/patient-history",
            icon: faSearch,
          },
          {
            label: "Daily Financial Report",
            link: "/reports",
            icon: faFileAlt,
          },
          { label: "Settings", link: "/settings", icon: faCog },
        ];

  return { menuItems };
};
