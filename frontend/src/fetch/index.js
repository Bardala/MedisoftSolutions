import { HOST } from "../config";
import { ApiError } from "./auth";

const errorFn = (status, message) => {
  const error = new ApiError(status, message);
  throw error;
};

export const ERROR = {
  TOKEN_EXPIRED: "TokenExpiredError",
  INVALID_TOKEN: "JsonWebTokenError",
  UNAUTHORIZED: "UnauthorizedError",
};

const extractParams = (endPoint, params) => {
  const apiParamsCount = String(endPoint).match(/:\w+/g)?.length || 0;
  let res = String(endPoint);

  if (apiParamsCount !== params.length)
    throw new Error("params count mismatch");

  for (let i = 0; i < apiParamsCount; i++) res = res.replace(/:\w+/, params[i]);

  return HOST + res;
};

export const fetchFn = async (endPoint, method, req, token, params) => {
  let url = HOST + endPoint;
  if (params) url = extractParams(endPoint, params);

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...(req && { body: JSON.stringify(req) }),
  });

  if (res.headers.get("Content-Type")?.includes("application/json")) {
    const data = await res.json();
    if (!res.ok)
      if (
        data.error === ERROR.TOKEN_EXPIRED ||
        data.error === ERROR.INVALID_TOKEN
      ) {
        localStorage.removeItem("currUser");
        window.location.reload();
        errorFn(res.status, data.error);
      } else if (data.error === ERROR.UNAUTHORIZED) {
        window.location.href = "/login";
        throw new ApiError(res.status, data.error);
      } else errorFn(res.status, data.error);
    return data;
  }

  if (!res.ok) errorFn(res.status, res.statusText);
  return res;
};
