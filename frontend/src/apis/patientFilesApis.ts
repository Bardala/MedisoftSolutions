import { fetchFn } from "../fetch";
import { ENDPOINT } from "../fetch/endpoints";
import { UploadFileReq, GetFilesRes } from "../types";

export const UploadFileApi = (req: UploadFileReq) => {
  const formData = new FormData();
  formData.append("patientId", req.patientId);
  formData.append("fileType", req.fileType);
  formData.append("description", "N/A");
  formData.append("file", req.file);

  return fetchFn<UploadFileReq, void>(
    ENDPOINT.UPLOAD_PATIENT_FILE,
    "POST",
    formData,
  );
};

export const GetFilesApi = (patientId: number) =>
  fetchFn<void, GetFilesRes[]>(ENDPOINT.GET_FILES, "GET", undefined, [
    patientId + "",
  ]);

export const DeleteFileApi = (fileId: number) =>
  fetchFn<void, void>(ENDPOINT.DELETE_FILE, "DELETE", undefined, [fileId + ""]);

export const DeleteFilesApi = (fileId: number) =>
  fetchFn<void, void>(ENDPOINT.DELETE_FILES, "DELETE", undefined, [
    fileId + "",
  ]);

export const GetTotalStorageUsageApi = (clinicId: number) =>
  fetchFn<void, number>(`${ENDPOINT.PATIENT_FILE}?clinicId=${clinicId}`, "GET");
