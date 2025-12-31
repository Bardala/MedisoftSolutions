import { LOCALS, ERROR_MESSAGES } from "@/app";
import { AppRoutes } from "@/app/constants";
import { RestMethod, ApiRes, ApiError } from "@/shared";
import { HOST } from "../config/HOST";
import { extractParams } from "@/utils";

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
      if (
        path !== AppRoutes.LOGIN &&
        path !== AppRoutes.WELCOME_PAGE &&
        path !== AppRoutes.SIGNUP
      ) {
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

export const getFetchFn = <Request, Response>(
  endPoint: string,
  params: string[] = null,
) => fetchFn<Request, Response>(endPoint, "GET", null, params);

export const postFetchFn = <Request, Response>(
  endPoint: string,
  req: Request,
  params: string[] = null,
) => fetchFn<Request, Response>(endPoint, "POST", req, params);

export const putFetchFn = <Request, Response>(
  endPoint: string,
  req: Request,
  params: string[] = null,
) => fetchFn<Request, Response>(endPoint, "PUT", req, params);

export const deleteFetchFn = <Request, Response>(
  endPoint: string,
  params: string[] = null,
) => fetchFn<Request, Response>(endPoint, "DELETE", null, params);
