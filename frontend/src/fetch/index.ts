import { errorFn } from "./ERROR";
import { HOST, extractParams } from "../utils/extractParams";
import { LOCALS } from "../utils/localStorage";

const apiVersion = "/api/v1";

type RestMethod = "GET" | "POST" | "DELETE" | "UPDATE";

interface ApiRes<T> {
  data: T;
  error: { [key: string]: string } | null;
}

export const fetchFn = async <Request, Response>(
  endPoint: string,
  method: RestMethod = "GET",
  req: Request = null,
  params: string[] = null,
): Promise<Response> => {
  const token = localStorage.getItem(LOCALS.AUTH_TOKEN);
  let url = HOST + apiVersion + endPoint;
  if (params) url = extractParams(apiVersion + endPoint, params);

  const res = await fetch(url, {
    credentials: "include", // Add this
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Origin: window.location.origin,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...(req && { body: JSON.stringify(req) }),
  });

  const jsonResponse: ApiRes<Response> = await res.json();

  if (!res.ok || jsonResponse.error) {
    throw new Error(
      JSON.stringify(jsonResponse.error || "Network response was not ok"),
    );
  }

  if (!res.ok || jsonResponse.error) {
    const errorMessage = jsonResponse.error
      ? JSON.stringify(jsonResponse.error)
      : "Unknown error";
    errorFn(res.status, errorMessage, jsonResponse.error);
    throw new Error(errorMessage);
  }

  return jsonResponse.data;
};
