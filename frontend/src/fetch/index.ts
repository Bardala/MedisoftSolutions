import { errorFn } from "./ERROR";
import { extractParams } from "../utils/extractParams";
import { HOST } from "../utils/HOST";
import { LOCALS } from "../utils/localStorage";
import { ApiRes, RestMethod } from "../types";
import { ApiError } from "./ApiError";

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
      if (window.location.pathname !== "/login")
        window.location.href = "/login";
    }

    if (!res.ok || (jsonResponse && jsonResponse.error)) {
      const errorMap = jsonResponse.error;

      const errorMessage = errorMap
        ? Object.entries(errorMap)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ") // Combines multiple messages
        : "Network response was not ok";
      errorFn(res.status, errorMessage, jsonResponse.error);
      throw new ApiError(res.status, errorMessage, jsonResponse.error);
    }

    return jsonResponse.data as Response;
  }

  if (!res.ok) {
    throw new ApiError(res.status, "Internal Server Error", {
      "error 500": "error 500: Internal Server Error",
    });
  }

  return res as Response;
};
