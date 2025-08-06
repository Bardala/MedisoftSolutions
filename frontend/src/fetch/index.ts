import { extractParams } from "../utils/extractParams";
import { HOST } from "../utils/HOST";
import { LOCALS } from "../utils/localStorage";
import { ApiRes, RestMethod } from "../types";
import { ApiError } from "./ApiError";
import { ERROR_MESSAGES } from "../utils/errorMessages";
import { AppRoutes } from "../constants";
import { ENDPOINT } from "./endpoints";

const apiVersion = "/api/v1";

export const fetchFn = async <Request, Response>(
  endPoint: string,
  method: RestMethod = "GET",
  req: Request | FormData = null,
  params: string[] = null,
): Promise<Response> => {
  const token = localStorage.getItem(LOCALS.AUTH_TOKEN);
  let url = HOST + apiVersion + endPoint;
  if (params) url = extractParams(apiVersion + endPoint, params);

  const headers: HeadersInit = {
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const options: RequestInit = {
    credentials: "include",
    method,
    headers,
  };

  if (req) {
    if (req instanceof FormData) {
      options.body = req;
    } else {
      headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(req);
    }
  }

  const res = await fetch(url, options);

  if (res.headers.get("content-type")?.includes("application/json")) {
    const jsonResponse: ApiRes<Response> = await res?.json();

    if (res.status === 401) {
      localStorage.removeItem(LOCALS.AUTH_TOKEN);
      localStorage.removeItem(LOCALS.CURR_USER);
      const path = window.location.pathname;
      if (path !== AppRoutes.LOGIN && path !== AppRoutes.WELCOME_PAGE) {
        window.location.href = AppRoutes.WELCOME_PAGE;
      }
    }

    if (!res.ok || (jsonResponse && jsonResponse.error)) {
      const errorMap = jsonResponse.error;

      const errorMessage = errorMap
        ? Object.entries(errorMap)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ") // Combines multiple messages
        : "Network response was not ok";
      throw new ApiError(res.status, errorMessage, jsonResponse.error);
    }

    if (endPoint.includes(ENDPOINT.GET_WEEKLY_SCHEDULE)) {
      console.log("Req: ", endPoint);
      console.info("Weekly schedule fetched successfully ", jsonResponse.data);
    }

    return jsonResponse.data as Response;
  }

  if (!res.ok) {
    const message =
      ERROR_MESSAGES[res.status] ||
      "Something unexpected happened. Hang tight while we fix it.";
    throw new ApiError(res.status, message, {
      [`error ${res.status}`]: message,
    });
  }

  return res as Response;
};
