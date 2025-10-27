import { VisitMedicineApi } from "@/core";
import { VisitMedicineResDTO, VisitMedicineReqDTO } from "@/dto";
import { ApiError, VisitMedicine } from "@/shared";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

export const useGetAllVisitMedicines = () => {
  const query = useQuery<VisitMedicineResDTO[], ApiError>(
    ["visit-medicines"],
    () => VisitMedicineApi.getAll(),
  );

  return { query };
};

export const useGetVisitMedicineById = (id: number) => {
  const query = useQuery<VisitMedicineResDTO, ApiError>(
    ["visit-medicines", id],
    () => VisitMedicineApi.getById(id),
    { enabled: !!id },
  );

  return { query };
};

export const useCreateVisitMedicine = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation<
    VisitMedicineResDTO,
    ApiError,
    VisitMedicineReqDTO
  >((visitMedicine) => VisitMedicineApi.create(visitMedicine), {
    onSuccess: (vm) => {
      queryClient.invalidateQueries(["visit-medicines", vm.visitId]);
    },
  });

  return {
    createVM: createMutation.mutateAsync,
    isErrorVM: createMutation.isError,
    errorVM: createMutation.error,
    isLoadingVM: createMutation.isLoading,
  };
};

export const useDeleteVisitMedicine = () => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation<void, ApiError, VisitMedicine>(
    (visitMedicine) => VisitMedicineApi.delete(visitMedicine.id),
    {
      onSuccess: (_, vm) => {
        queryClient.invalidateQueries(["visit-medicines", vm.visitId]);
      },
    },
  );

  return { deleteMutation };
};

export const useGetVisitMedicinesByVisitId = (visitId: number) => {
  const query = useQuery<VisitMedicineResDTO[], ApiError>(
    ["visit-medicines", visitId],
    () => VisitMedicineApi.getByVisit(visitId),
    { enabled: !!visitId },
  );

  return { query };
};

// Hook to fetch VisitMedicines by Medicine ID
export const useGetVisitMedicinesByMedicineId = (medicineId: number) => {
  const query = useQuery<VisitMedicineResDTO[], ApiError>(
    ["visit-medicines", "medicine", medicineId],
    () => VisitMedicineApi.getByMedicine(medicineId),
    { enabled: !!medicineId },
  );

  return { query };
};
