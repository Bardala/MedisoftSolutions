import { fetchFn } from "./fetch";

export const signupApi = (username, role, password) =>
  fetchFn("/api/auth/signup", "POST", { username, role, password });

export const loginApi = (login, password) =>
  fetchFn("/api/auth/login", "POST", { login, password });
