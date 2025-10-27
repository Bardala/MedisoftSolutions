import { User } from ".";

export interface HomePageProps {
  loggedInUser: User | null;
}

export interface SidebarProps {
  loggedInUser: HomePageProps["loggedInUser"];
}

export type HeaderProps = SidebarProps;
