export const HOST = `http://192.168.1.2:8080`;

export const host = (url: string) => {
  const baseUrl = new URL(HOST);
  return new URL(url, baseUrl).toString();
};

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
