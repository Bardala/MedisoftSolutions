import { fetchFn } from "../fetch";
import { ENDPOINT } from "../fetch/endpoints";
import { VisitMedicine, CreateVisitMedicineReq } from "../types";

// *VisitMedicine APIs
// Fetch all VisitMedicines

export const GetAllVisitMedicinesApi = () =>
  fetchFn<void, VisitMedicine[]>(ENDPOINT.GET_ALL_VISIT_MEDICINES);
// Fetch a specific VisitMedicine by ID

export const GetVisitMedicineByIdApi = (id: number) =>
  fetchFn<void, VisitMedicine>(
    ENDPOINT.GET_VISIT_MEDICINE_BY_ID,
    "GET",
    undefined,
    [id.toString()],
  );
// Create a new VisitMedicine

export const CreateVisitMedicineApi = (visitMedicine: CreateVisitMedicineReq) =>
  fetchFn<VisitMedicine, VisitMedicine>(
    ENDPOINT.CREATE_VISIT_MEDICINE,
    "POST",
    visitMedicine,
  );
// Delete a VisitMedicine by ID

export const DeleteVisitMedicineApi = (visitMedicine: VisitMedicine) =>
  fetchFn<void, void>(ENDPOINT.DELETE_VISIT_MEDICINE, "DELETE", undefined, [
    visitMedicine?.id.toString(),
  ]);
// Fetch VisitMedicines by Visit ID

export const GetVisitMedicinesByVisitIdApi = (visitId: number) =>
  fetchFn<void, VisitMedicine[]>(
    ENDPOINT.GET_VISIT_MEDICINES_BY_VISIT_ID,
    "GET",
    undefined,
    [visitId.toString()],
  );
// Fetch VisitMedicines by Medicine ID

export const GetVisitMedicinesByMedicineIdApi = (medicineId: number) =>
  fetchFn<void, VisitMedicine[]>(
    ENDPOINT.GET_VISIT_MEDICINES_BY_MEDICINE_ID,
    "GET",
    undefined,
    [medicineId.toString()],
  );
