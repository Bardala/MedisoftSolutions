import { VisitMedicineReqDTO, VisitMedicineResDTO } from "../dto";
import { fetchFn } from "../fetch";
import { ENDPOINT } from "../fetch/endpoints";

export const GetAllVisitMedicinesApi = () =>
  fetchFn<void, VisitMedicineResDTO[]>(ENDPOINT.GET_ALL_VISIT_MEDICINES);

export const GetVisitMedicineByIdApi = (id: number) =>
  fetchFn<void, VisitMedicineResDTO>(
    ENDPOINT.GET_VISIT_MEDICINE_BY_ID,
    "GET",
    undefined,
    [id.toString()],
  );

export const CreateVisitMedicineApi = (visitMedicine: VisitMedicineReqDTO) =>
  fetchFn<VisitMedicineReqDTO, VisitMedicineResDTO>(
    ENDPOINT.CREATE_VISIT_MEDICINE,
    "POST",
    visitMedicine,
  );

export const DeleteVisitMedicineApi = (visitMedicineId: number) =>
  fetchFn<void, void>(ENDPOINT.DELETE_VISIT_MEDICINE, "DELETE", undefined, [
    visitMedicineId.toString(),
  ]);

export const GetVisitMedicinesByVisitIdApi = (visitId: number) =>
  fetchFn<void, VisitMedicineResDTO[]>(
    ENDPOINT.GET_VISIT_MEDICINES_BY_VISIT_ID,
    "GET",
    undefined,
    [visitId.toString()],
  );

export const GetVisitMedicinesByMedicineIdApi = (medicineId: number) =>
  fetchFn<void, VisitMedicineResDTO[]>(
    ENDPOINT.GET_VISIT_MEDICINES_BY_MEDICINE_ID,
    "GET",
    undefined,
    [medicineId.toString()],
  );

export const VisitMedicineApi = {
  getAll: () =>
    fetchFn<void, VisitMedicineResDTO[]>(ENDPOINT.GET_ALL_VISIT_MEDICINES),

  getById: (id: number) =>
    fetchFn<void, VisitMedicineResDTO>(
      ENDPOINT.GET_VISIT_MEDICINE_BY_ID,
      "GET",
      undefined,
      [id.toString()],
    ),

  create: (visitMedicine: VisitMedicineReqDTO) =>
    fetchFn<VisitMedicineReqDTO, VisitMedicineResDTO>(
      ENDPOINT.CREATE_VISIT_MEDICINE,
      "POST",
      visitMedicine,
    ),

  delete: (visitMedicineId: number) =>
    fetchFn<void, void>(ENDPOINT.DELETE_VISIT_MEDICINE, "DELETE", undefined, [
      visitMedicineId.toString(),
    ]),

  getByVisit: (visitId: number) =>
    fetchFn<void, VisitMedicineResDTO[]>(
      ENDPOINT.GET_VISIT_MEDICINES_BY_VISIT_ID,
      "GET",
      undefined,
      [visitId.toString()],
    ),

  getByMedicine: (medicineId: number) =>
    fetchFn<void, VisitMedicineResDTO[]>(
      ENDPOINT.GET_VISIT_MEDICINES_BY_MEDICINE_ID,
      "GET",
      undefined,
      [medicineId.toString()],
    ),
};
