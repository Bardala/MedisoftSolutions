import { MedicineResDTO, MedicineReqDTO } from "@/dto";
import { ENDPOINT } from "../config/endpoints";
import { fetchFn } from "../http-client/fetchFn";

export const GetAllMedicinesApi = () =>
  fetchFn<void, MedicineResDTO[]>(ENDPOINT.GET_ALL_MEDICINES);

export const GetMedicineByIdApi = (id: number) =>
  fetchFn<void, MedicineResDTO>(ENDPOINT.GET_MEDICINE_BY_ID, "GET", undefined, [
    id.toString(),
  ]);

export const CreateMedicineApi = (medicine: MedicineReqDTO) =>
  fetchFn<MedicineReqDTO, MedicineResDTO>(
    ENDPOINT.CREATE_MEDICINE,
    "POST",
    medicine,
  );

export const UpdateMedicineApi = (medicine: MedicineReqDTO) =>
  fetchFn<MedicineReqDTO, MedicineResDTO>(
    ENDPOINT.UPDATE_MEDICINE,
    "PUT",
    medicine,
  );

export const DeleteMedicineApi = (id: number) =>
  fetchFn<void, void>(ENDPOINT.DELETE_MEDICINE, "DELETE", undefined, [
    id.toString(),
  ]);

export const GetMedicineBatch = (ids: number[]) =>
  fetchFn<void, MedicineResDTO[]>(
    `${ENDPOINT.MEDICINE_BATCH}?ids=${ids.join(",")}`,
    "GET",
  );

export const MedicineApi = {
  getAll: () => fetchFn<void, MedicineResDTO[]>(ENDPOINT.GET_ALL_MEDICINES),

  getById: (id: number) =>
    fetchFn<void, MedicineResDTO>(
      ENDPOINT.GET_MEDICINE_BY_ID,
      "GET",
      undefined,
      [id.toString()],
    ),

  create: (medicine: MedicineReqDTO) =>
    fetchFn<MedicineReqDTO, MedicineResDTO>(
      ENDPOINT.CREATE_MEDICINE,
      "POST",
      medicine,
    ),

  update: (medicine: MedicineReqDTO) =>
    fetchFn<MedicineReqDTO, MedicineResDTO>(
      ENDPOINT.UPDATE_MEDICINE,
      "PUT",
      medicine,
    ),

  delete: (id: number) =>
    fetchFn<void, void>(ENDPOINT.DELETE_MEDICINE, "DELETE", undefined, [
      id.toString(),
    ]),

  getBatch: (ids: number[]) =>
    fetchFn<void, MedicineResDTO[]>(
      `${ENDPOINT.MEDICINE_BATCH}?ids=${ids.join(",")}`,
      "GET",
    ),
};
