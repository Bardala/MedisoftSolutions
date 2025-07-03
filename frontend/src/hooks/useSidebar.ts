import {
  faUsers,
  faCalendarAlt,
  faCog,
  faSearch,
  faFileArchive,
  faProcedures,
  IconDefinition,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { User } from "../types";
import { useIntl } from "react-intl";

export interface MenuItem {
  label: string;
  link: string;
  icon: IconDefinition;
}

export const useSidebar = (loggedInUser: User) => {
  const { formatMessage: f } = useIntl();
  const isDoctor = loggedInUser.role === "Doctor";
  const isSuperAdmin = loggedInUser.role === "SuperAdmin";

  const menuItems: MenuItem[] = [];

  if (isSuperAdmin)
    menuItems.push(
      {
        label: f({ id: "create_new_clinic" }),
        link: "/create-clinic",
        icon: faPlus,
      },
      {
        label: f({ id: "settings" }),
        link: "/settings",
        icon: faCog,
      },
    );
  else
    menuItems.push(
      {
        label: f({ id: "sidebar.currentPatient" }),
        link: "/patient-profile",
        icon: faProcedures,
      },
      {
        label: f({ id: "waitList" }),
        link: "/patients",
        icon: faUsers,
      },
      {
        label: f({ id: "registry" }),
        link: "/patient-history",
        icon: faSearch,
      },
      {
        label: f({ id: "dailyReports" }),
        link: "/reports",
        icon: faFileArchive,
      },
      ...(isDoctor
        ? [
            {
              label: f({ id: "monthlyReports" }),
              link: "/monthly-reports",
              icon: faCalendarAlt,
            },
          ]
        : []),
      {
        label: f({ id: "settings" }),
        link: "/settings",
        icon: faCog,
      },
    );

  return { menuItems };
};
