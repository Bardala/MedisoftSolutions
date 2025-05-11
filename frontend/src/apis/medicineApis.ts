import { fetchFn } from "../fetch";
import { ENDPOINT } from "../fetch/endpoints";
import { Medicine, CreateMedicineReq, UpdateMedicineReq } from "../types";

// *Medicine APIs
// Fetch all Medicines

export const GetAllMedicinesApi = () =>
  fetchFn<void, Medicine[]>(ENDPOINT.GET_ALL_MEDICINES);
// Fetch a specific Medicine by ID

export const GetMedicineByIdApi = (id: number) =>
  fetchFn<void, Medicine>(ENDPOINT.GET_MEDICINE_BY_ID, "GET", undefined, [
    id.toString(),
  ]);
// Create a new Medicine

export const CreateMedicineApi = (medicine: CreateMedicineReq) =>
  fetchFn<Medicine, Medicine>(ENDPOINT.CREATE_MEDICINE, "POST", medicine);
// Update a Medicine by ID

export const UpdateMedicineApi = (medicine: UpdateMedicineReq) =>
  fetchFn<Medicine, Medicine>(ENDPOINT.UPDATE_MEDICINE, "PUT", medicine);
// Delete a Medicine by ID

export const DeleteMedicineApi = (id: number) =>
  fetchFn<void, void>(ENDPOINT.DELETE_MEDICINE, "DELETE", undefined, [
    id.toString(),
  ]);
