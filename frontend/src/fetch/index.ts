import { errorFn } from "./ERROR";
import { HOST, extractParams } from "../utils/extractParams";
import { LOCALS } from "../utils/localStorage";
import { ApiRes, RestMethod } from "../types/types";
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

  const jsonResponse: ApiRes<Response> = await res?.json();

  if (!res.ok || jsonResponse.error) {
    const errorMessage = jsonResponse.error
      ? JSON.stringify(jsonResponse.error)
      : "Network response was not ok";
    errorFn(res.status, errorMessage, jsonResponse.error);
    throw new ApiError(res.status, errorMessage, jsonResponse.error);
  }

  return jsonResponse.data;
};
