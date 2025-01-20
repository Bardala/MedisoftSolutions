import { GetFilesRes } from "../types";
import { ApiError } from "../fetch/ApiError";
import { GetFilesApi } from "../fetch/api";
import { useQuery } from "@tanstack/react-query";

export const useGetFiles = (patientId: number) => {
  const patientFiles = useQuery<GetFilesRes[], ApiError>(
    ["files", patientId],
    () => GetFilesApi(patientId),
    {
      enabled: !!patientId,
    },
  );

  return { patientFiles };
};
