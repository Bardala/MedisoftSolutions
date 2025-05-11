import { fetchFn } from "../fetch";
import { ENDPOINT } from "../fetch/endpoints";
import {
  UploadFileReq,
  UploadFileRes,
  GetFilesReq,
  GetFilesRes,
  DeleteFileReq,
  DeleteFileRes,
  DeleteFilesReq,
  DeleteFilesRes,
} from "../types";

//* Files

export const UploadFileApi = (req: UploadFileReq) => {
  const formData = new FormData();
  formData.append("patientId", req.patientId);
  formData.append("fileType", req.fileType);
  formData.append("description", "N/A");
  formData.append("file", req.file);

  return fetchFn<UploadFileReq, UploadFileRes>(
    ENDPOINT.UPLOAD_PATIENT_FILE,
    "POST",
    formData,
  );
};

export const GetFilesApi = (patientId: number) =>
  fetchFn<GetFilesReq, GetFilesRes[]>(ENDPOINT.GET_FILES, "GET", undefined, [
    patientId + "",
  ]);

export const DeleteFileApi = (fileId: number) =>
  fetchFn<DeleteFileReq, DeleteFileRes>(
    ENDPOINT.DELETE_FILE,
    "DELETE",
    undefined,
    [fileId + ""],
  );

export const DeleteFilesApi = (fileId: number) =>
  fetchFn<DeleteFilesReq, DeleteFilesRes>(
    ENDPOINT.DELETE_FILES,
    "DELETE",
    undefined,
    [fileId + ""],
  );
