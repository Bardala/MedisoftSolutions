import { DeleteFileRes, DeleteFilesRes, GetFilesRes } from "../types";
import { ApiError } from "../fetch/ApiError";
import { DeleteFileApi, DeleteFilesApi, GetFilesApi } from "../apis";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useFileOperations = (patientId: number) => {
  const patientFiles = useQuery<GetFilesRes[], ApiError>(
    ["files", patientId],
    () => GetFilesApi(patientId),
    {
      enabled: !!patientId,
    },
  );

  const deleteFileMutation = useMutation<DeleteFileRes, ApiError, number>(
    (fileId) => DeleteFileApi(fileId),
  );

  const deleteFilesMutation = useMutation<DeleteFilesRes, ApiError, number>(
    (patientId) => DeleteFilesApi(patientId),
  );

  return { patientFiles, deleteFileMutation, deleteFilesMutation };
};
