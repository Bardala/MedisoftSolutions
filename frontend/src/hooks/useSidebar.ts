import {
  faUsers,
  faCalendarAlt,
  faCog,
  faSearch,
  faFileArchive,
  faProcedures,
} from "@fortawesome/free-solid-svg-icons";
import { MenuItem, User } from "../types";
import { useIntl } from "react-intl";

export const useSidebar = (loggedInUser: User) => {
  const { formatMessage } = useIntl(); // Get translation function
  const isDoctor = loggedInUser.role === "Doctor";

  const menuItems: MenuItem[] = [
    {
      label: formatMessage({ id: "sidebar.currentPatient" }),
      link: "/patient-profile",
      icon: faProcedures,
    },
    {
      label: formatMessage({ id: "waitList" }),
      link: "/patients",
      icon: faUsers,
    },
    {
      label: formatMessage({ id: "registry" }),
      link: "/patient-history",
      icon: faSearch,
    },
    {
      label: formatMessage({ id: "dailyReports" }),
      link: "/reports",
      icon: faFileArchive,
    },
    ...(isDoctor
      ? [
          {
            label: formatMessage({ id: "monthlyReports" }),
            link: "/monthly-reports",
            icon: faCalendarAlt,
          },
        ]
      : []),
    {
      label: formatMessage({ id: "settings" }),
      link: "/settings",
      icon: faCog,
    },
  ];

  return { menuItems };
};
