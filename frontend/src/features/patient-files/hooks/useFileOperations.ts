import {
  GetFilesApi,
  UploadFileApi,
  DeleteFileApi,
  DeleteFilesApi,
} from "@/core";
import { GetFilesRes, ApiError, UploadFileReq } from "@/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useFileOperations = (patientId: number) => {
  const queryClient = useQueryClient();

  const patientFiles = useQuery<GetFilesRes[], ApiError>(
    ["files", patientId],
    () => GetFilesApi(patientId),
    {
      enabled: !!patientId,
      // Disable caching for immediate updates
      staleTime: 0,
      cacheTime: 0,
    },
  );

  const uploadFileMutation = useMutation<void, ApiError, UploadFileReq>(
    async (req) => UploadFileApi(req),
    {
      onMutate: async (newFile) => {
        await queryClient.cancelQueries(["files", patientId]);
        const previousFiles = queryClient.getQueryData<GetFilesRes[]>([
          "files",
          patientId,
        ]);

        if (previousFiles) {
          queryClient.setQueryData<GetFilesRes[]>(
            ["files", patientId],
            [
              ...previousFiles,
              {
                id: Date.now(), // temporary ID
                fileType: newFile.fileType,
                description: newFile.description,
                filePath: "", // will be updated after real upload
              },
            ],
          );
        }

        return { previousFiles };
      },
      onSettled: () => {
        queryClient.invalidateQueries(["files", patientId]);
      },
    },
  );

  const deleteFileMutation = useMutation<void, ApiError, number>(
    (fileId) => DeleteFileApi(fileId),
    {
      onMutate: async (fileId) => {
        await queryClient.cancelQueries(["files", patientId]);
        const previousFiles = queryClient.getQueryData<GetFilesRes[]>([
          "files",
          patientId,
        ]);

        if (previousFiles) {
          queryClient.setQueryData<GetFilesRes[]>(
            ["files", patientId],
            previousFiles.filter((file) => file.id !== fileId),
          );
        }

        return { previousFiles };
      },
      onSettled: () => {
        queryClient.invalidateQueries(["files", patientId]);
      },
    },
  );

  const deleteFilesMutation = useMutation<void, ApiError, number>(
    (patientId) => DeleteFilesApi(patientId),
    {
      onMutate: async () => {
        await queryClient.cancelQueries(["files", patientId]);
        const previousFiles = queryClient.getQueryData<GetFilesRes[]>([
          "files",
          patientId,
        ]);

        queryClient.setQueryData(["files", patientId], []);

        return { previousFiles };
      },

      onSettled: () => {
        queryClient.invalidateQueries(["files", patientId]);
      },
    },
  );

  return {
    patientFiles,
    uploadFileMutation,
    deleteFileMutation,
    deleteFilesMutation,
  };
};
