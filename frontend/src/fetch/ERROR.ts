import { ApiError } from "./ApiError";

export const ERROR = {
  TOKEN_EXPIRED: "TokenExpiredError",
  INVALID_TOKEN: "JsonWebTokenError",
  UNAUTHORIZED: "UnauthorizedError",
};

export const errorFn = (
  status: number,
  message: string,
  errors: { [key: string]: string } | null = null,
) => {
  const error = new ApiError(status, message, errors);

  console.error("errorFn", error);
  throw error;
};
