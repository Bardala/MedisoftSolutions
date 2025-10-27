import { ApiError } from "@/shared";

const customRetry = (failureCount: number, error: ApiError): boolean => {
  if (!error || typeof error.status !== "number") return failureCount < 2;

  const status = error.status;

  // Don't retry for client errors (400–499), especially 404
  if (status >= 400 && status < 500) return false;

  // Retry up to 2 times for server errors (500+)
  return failureCount < 2;
};

export default customRetry;
