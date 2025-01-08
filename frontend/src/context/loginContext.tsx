import React, { createContext, useContext, useState } from "react";
import { LOCALS } from "../utils/localStorage";
import { CurrUserinfoApi, loginApi } from "../fetch/api";
import { LoginContextType, LoginProviderProps, User } from "../types";

const LoginContext = createContext<LoginContextType | null>(null);

// Create a provider component
export const LoginProvider: React.FC<LoginProviderProps> = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(
    JSON.parse(localStorage.getItem(LOCALS.CURR_USER) as string),
  );

  const currUserInfo = async (token: string): Promise<void> => {
    const user = await CurrUserinfoApi(token);
    setLoggedInUser(user);
    localStorage.setItem(LOCALS.CURR_USER, JSON.stringify(user));
    localStorage.setItem(LOCALS.AUTH_TOKEN, token); // Save token for subsequent requests
  };

  const login = async (username: string, password: string): Promise<void> => {
    try {
      const response = await loginApi(username, password);
      const { token } = response;
      await currUserInfo(token);
    } catch (error) {
      throw error; // Optionally re-throw for handling in the calling component
    }
  };

  const logout = (): void => {
    setLoggedInUser(null);
    localStorage.removeItem(LOCALS.CURR_USER);
    localStorage.removeItem(LOCALS.AUTH_TOKEN);
  };

  return (
    <LoginContext.Provider value={{ loggedInUser, login, logout }}>
      {children}
    </LoginContext.Provider>
  );
};

// Custom hook for easy access
export const useLogin = (): LoginContextType => {
  const context = useContext(LoginContext);
  if (!context) {
    throw new Error("useLogin must be used within a LoginProvider");
  }
  return context;
};
