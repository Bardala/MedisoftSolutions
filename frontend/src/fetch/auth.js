import { useQueryClient } from "@tanstack/react-query";

import { LOCALS } from "../utils/localStorage";

export class ApiError extends Error {
  status;

  constructor(status, msg) {
    super(msg);
    this.status = status;
  }
}

export const isLoggedIn = () => {
  return !!localStorage.getItem(LOCALS.CURR_USER);
};

export const logOut = async () => {
  localStorage.removeItem(LOCALS.CURR_USER);
};

export const useLogOut = () => {
  const queryClient = useQueryClient();

  const logOut = async () => {
    localStorage.removeItem(LOCALS.CURR_USER);
    queryClient.removeQueries();
  };

  return { logOut };
};
