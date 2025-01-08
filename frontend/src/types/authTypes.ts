import { User } from "./userTypes";

export interface LoginResponse {
  token: string;
  username: string;
}

export interface LoginContextType {
  loggedInUser: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface LoginProviderProps {
  children: React.ReactNode;
}
