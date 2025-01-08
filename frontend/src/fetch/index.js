import { errorFn } from "./ERROR";
import { HOST, extractParams } from "../utils/extractParams";
import { LOCALS } from "../utils/localStorage";

export const fetchFn = async ({
  endPoint,
  method = "GET",
  req = null,
  token = localStorage.getItem(LOCALS.AUTH_TOKEN),
  params = null,
}) => {
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

  if (!res.ok) {
    const { status, message } = await res.json();
    errorFn(status, message);
  }

  return res.json();
};
