import {
  faUsers,
  faCalendarAlt,
  faCog,
  faSearch,
  faFileArchive,
  faProcedures,
} from "@fortawesome/free-solid-svg-icons";
import { MenuItem, User } from "../types";

export const useSidebar = (loggedInUser: User) => {
  const isDoctor = loggedInUser.role === "Doctor";

  const menuItems: MenuItem[] = [
    {
      label: "Current Patient",
      link: "/patient-profile",
      icon: faProcedures,
    },
    {
      label: "Wait List",
      link: "/patients",
      icon: faUsers,
    },
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
    ...(isDoctor
      ? [
          {
            label: "Monthly Reports",
            link: "/monthly-reports",
            icon: faCalendarAlt,
          },
        ]
      : []),
    {
      label: "Settings",
      link: "/settings",
      icon: faCog,
    },
  ];

  return { menuItems };
};
