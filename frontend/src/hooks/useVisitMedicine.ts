import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { VisitMedicine } from "../types";
import { ApiError } from "../fetch/ApiError";
import {
  GetAllVisitMedicinesApi,
  GetVisitMedicineByIdApi,
  CreateVisitMedicineApi,
  DeleteVisitMedicineApi,
  GetVisitMedicinesByVisitIdApi,
  GetVisitMedicinesByMedicineIdApi,
} from "../apis";

export const useGetAllVisitMedicines = () => {
  const query = useQuery<VisitMedicine[], ApiError>(["visit-medicines"], () =>
    GetAllVisitMedicinesApi(),
  );

  return { query };
};

export const useGetVisitMedicineById = (id: number) => {
  const query = useQuery<VisitMedicine, ApiError>(
    ["visit-medicines", id],
    () => GetVisitMedicineByIdApi(id),
    { enabled: !!id },
  );

  return { query };
};

export const useCreateVisitMedicine = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation<VisitMedicine, ApiError, VisitMedicine>(
    (visitMedicine) => CreateVisitMedicineApi(visitMedicine),
    {
      onSuccess: (_, visitMedicine) => {
        queryClient.invalidateQueries([
          "visit-medicines",
          visitMedicine.visit.id,
        ]);
      },
    },
  );

  return { createMutation };
};

export const useDeleteVisitMedicine = () => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation<void, ApiError, VisitMedicine>(
    (visitMedicine) => DeleteVisitMedicineApi(visitMedicine),
    {
      onSuccess: (_, visitMedicine) => {
        queryClient.invalidateQueries([
          "visit-medicines",
          visitMedicine.visit.id,
        ]);
      },
    },
  );

  return { deleteMutation };
};

export const useGetVisitMedicinesByVisitId = (visitId: number) => {
  const query = useQuery<VisitMedicine[], ApiError>(
    ["visit-medicines", visitId],
    () => GetVisitMedicinesByVisitIdApi(visitId),
    { enabled: !!visitId },
  );

  return { query };
};

// Hook to fetch VisitMedicines by Medicine ID
export const useGetVisitMedicinesByMedicineId = (medicineId: number) => {
  const query = useQuery<VisitMedicine[], ApiError>(
    ["visit-medicines", "medicine", medicineId],
    () => GetVisitMedicinesByMedicineIdApi(medicineId),
    { enabled: !!medicineId },
  );

  return { query };
};
