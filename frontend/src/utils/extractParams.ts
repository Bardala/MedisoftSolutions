export const HOST = `http://localhost:8080`;

export const extractParams = (endPoint, params) => {
  const apiParamsCount = String(endPoint).match(/:\w+/g)?.length || 0;
  let res = String(endPoint);

  if (apiParamsCount !== params.length)
    throw new Error("params count mismatch");

  for (let i = 0; i < apiParamsCount; i++) res = res.replace(/:\w+/, params[i]);

  return HOST + res;
};
