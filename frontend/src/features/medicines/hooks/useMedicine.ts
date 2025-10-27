import { MedicineApi } from "@/core";
import { MedicineResDTO, MedicineReqDTO } from "@/dto";
import { ApiError } from "@/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAllMedicines = () => {
  const query = useQuery<MedicineResDTO[], ApiError>(["medicines"], () =>
    MedicineApi.getAll(),
  );

  return { query };
};

export const useGetMedicineById = (id: number) => {
  const query = useQuery<MedicineResDTO, ApiError>(
    ["medicines", id],
    () => MedicineApi.getById(id),
    {
      enabled: !!id,
    },
  );

  return { query };
};

export const useCreateMedicine = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation<MedicineResDTO, ApiError, MedicineReqDTO>(
    (medicine) => MedicineApi.create(medicine),
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

  const updateMutation = useMutation<MedicineResDTO, ApiError, MedicineReqDTO>(
    (medicine) => MedicineApi.update(medicine),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["medicines"]);
      },
    },
  );

  return {
    updateMedicine: updateMutation,
    isError: updateMutation.isError,
    isLoading: updateMutation.isLoading,
    error: updateMutation.error,
  };
};

export const useDeleteMedicine = () => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation<void, ApiError, number>(
    (id) => MedicineApi.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["medicines"]);
      },
    },
  );

  return { deleteMutation };
};

export const useGetMedicineBatch = (ids: number[]) => {
  const medicinesBatchQuery = useQuery<MedicineResDTO[], ApiError>(
    ["medicines", "batch", ids],
    () => MedicineApi.getBatch(ids),
    { enabled: ids.length > 0 },
  );

  return {
    data: medicinesBatchQuery.data,
    isError: medicinesBatchQuery.isError,
    isLoading: medicinesBatchQuery.isLoading,
    error: medicinesBatchQuery.error,
  };
};
