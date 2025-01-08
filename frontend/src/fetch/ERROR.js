import { ApiError } from "./auth";

export const ERROR = {
  TOKEN_EXPIRED: "TokenExpiredError",
  INVALID_TOKEN: "JsonWebTokenError",
  UNAUTHORIZED: "UnauthorizedError",
};

export const errorFn = (status, message) => {
  const error = new ApiError(status, message);

  console.error("errorFn", error);
  throw error;
};
