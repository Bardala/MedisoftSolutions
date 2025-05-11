import React, { createContext, useContext, useState } from "react";
import { LOCALS } from "../utils/localStorage";
import { CurrUserinfoApi } from "../apis/userApis";
import { loginApi } from "../apis/authApis";
import { LoginContextType, LoginProviderProps, User } from "../types";
import { ApiError } from "../fetch/ApiError";

const LoginContext = createContext<LoginContextType | null>(null);

export const LoginProvider: React.FC<LoginProviderProps> = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(
    JSON.parse(localStorage.getItem(LOCALS.CURR_USER) as string),
  );
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<ApiError>(null);

  const currUserInfo = async (): Promise<void> => {
    try {
      const user = await CurrUserinfoApi();
      setLoggedInUser(user);
      localStorage.setItem(LOCALS.CURR_USER, JSON.stringify(user));
    } catch (err) {
      setError(err);
      console.error(err);
    }
  };

  // todo: Handle error like fetch/index.ts
  const login = async (username: string, password: string): Promise<void> => {
    setError(null);
    try {
      const response = await loginApi(username, password);
      const { token } = response;
      localStorage.setItem(LOCALS.AUTH_TOKEN, token);
      await currUserInfo();
      setSuccess(true);
    } catch (err) {
      setError(err);
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
