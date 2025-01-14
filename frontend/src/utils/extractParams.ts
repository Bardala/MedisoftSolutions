export const HOST = `http://localhost:8080`;

export const extractParams = (endPoint: string, params: string[]) => {
  const apiParamsCount = String(endPoint).match(/:\w+/g)?.length || 0;
  let res = String(endPoint);

  if (apiParamsCount !== params.length)
    throw new Error(
      `params count mismatch, paramsLength=${params.length}, paramsCount=${apiParamsCount}`,
    );

  for (let i = 0; i < apiParamsCount; i++) res = res.replace(/:\w+/, params[i]);

  return HOST + res;
};
