import { User } from "./";

export interface HomePageProps {
  loggedInUser: User | null;
}

export interface SidebarProps {
  loggedInUser: HomePageProps["loggedInUser"];
  setSelectedOption: (option: string) => void;
}

export type HeaderProps = SidebarProps;
