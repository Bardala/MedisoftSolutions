export const ERROR = {
  TOKEN_EXPIRED: "TokenExpiredError",
  INVALID_TOKEN: "JsonWebTokenError",
  UNAUTHORIZED: "UnauthorizedError",
};

export class ApiError extends Error {
  public status: number;
  public errors: { [key: string]: string } | null;

  constructor(
    status: number,
    msg: string,
    errors: { [key: string]: string } | null = null,
  ) {
    super(msg);
    this.status = status;
    this.errors = errors;
  }
}

export const errorFn = (
  status: number,
  message: string,
  errors: { [key: string]: string } | null = null,
) => {
  const error = new ApiError(status, message, errors);

  console.error("errorFn", error);
  throw error;
};
