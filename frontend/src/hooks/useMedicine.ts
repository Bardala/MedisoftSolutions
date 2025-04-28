import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  UpdateMedicineReq,
  UpdateMedicineRes,
  GetMedicineByIdRes,
  Medicine,
} from "../types";
import { ApiError } from "../fetch/ApiError";
import {
  GetAllMedicinesApi,
  GetMedicineByIdApi,
  CreateMedicineApi,
  UpdateMedicineApi,
  DeleteMedicineApi,
} from "../apis";

export const useGetAllMedicines = () => {
  const query = useQuery<Medicine[], ApiError>(["medicines"], () =>
    GetAllMedicinesApi(),
  );

  return { query };
};

export const useGetMedicineById = (id: number) => {
  const query = useQuery<GetMedicineByIdRes, ApiError>(
    ["medicines", id],
    () => GetMedicineByIdApi(id),
    {
      enabled: !!id,
    },
  );

  return { query };
};

export const useCreateMedicine = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation<Medicine, ApiError, Medicine>(
    (medicine) => CreateMedicineApi(medicine),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["medicines"]);
      },
    },
  );

  return { createMutation };
};

export const useUpdateMedicine = () => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation<
    UpdateMedicineRes,
    ApiError,
    UpdateMedicineReq
  >((medicine) => UpdateMedicineApi(medicine), {
    onSuccess: () => {
      queryClient.invalidateQueries(["medicines"]);
    },
  });

  return { updateMutation };
};

export const useDeleteMedicine = () => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation<void, ApiError, number>(
    (id) => DeleteMedicineApi(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["medicines"]);
      },
    },
  );

  return { deleteMutation };
};
