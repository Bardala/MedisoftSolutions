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
import { isDoctorOrOwnerRole, isSuperAdminRole, User } from "@/shared/types";
import { useIntl } from "react-intl";

export interface MenuItem {
  label: string;
  link: string;
  icon: IconDefinition;
}

const useSidebar = (loggedInUser: User) => {
  const { formatMessage: f } = useIntl();
  const isSuperAdmin = isSuperAdminRole(loggedInUser.role);

  const menuItems: MenuItem[] = [];
  const superAdminItems = [
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
  ];

  const clinicRoutes = [
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
    ...(isDoctorOrOwnerRole(loggedInUser.role)
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
  ];

  if (isSuperAdmin) menuItems.push(...superAdminItems);
  else menuItems.push(...clinicRoutes);

  return { menuItems };
};

export default useSidebar;
