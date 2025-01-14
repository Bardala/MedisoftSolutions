import React, { createContext, useContext, useState } from "react";
import { LOCALS } from "../utils/localStorage";
import { CurrUserinfoApi, loginApi } from "../fetch/api";
import { LoginContextType, LoginProviderProps, User } from "../types";
import { ApiError } from "../fetch/ERROR";

const LoginContext = createContext<LoginContextType | null>(null);

export const LoginProvider: React.FC<LoginProviderProps> = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(
    JSON.parse(localStorage.getItem(LOCALS.CURR_USER) as string),
  );
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currUserInfo = async (): Promise<void> => {
    try {
      const user = await CurrUserinfoApi();
      setLoggedInUser(user);
      localStorage.setItem(LOCALS.CURR_USER, JSON.stringify(user));
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to fetch user information");
      }
      console.error(err);
    }
  };

  const login = async (username: string, password: string): Promise<void> => {
    setError(null);
    try {
      const response = await loginApi(username, password);
      const { token } = response;
      localStorage.setItem(LOCALS.AUTH_TOKEN, token);
      await currUserInfo();
      setSuccess(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(String(err));
      }
      console.error(err);
    }
  };

  const logout = (): void => {
    setLoggedInUser(null);
    localStorage.removeItem(LOCALS.CURR_USER);
    localStorage.removeItem(LOCALS.AUTH_TOKEN);
    setSuccess(false);
  };

  return (
    <LoginContext.Provider
      value={{ loggedInUser, login, logout, success, error }}
    >
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
