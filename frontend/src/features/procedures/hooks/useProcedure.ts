import { ProcedureApi } from "@/core";
import { ProcedureResDTO, ProcedureReqDTO } from "@/dto";
import { ApiError, Procedure } from "@/shared";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

export const useProcedures = () => {
  const proceduresQuery = useQuery<ProcedureResDTO[], ApiError>(
    ["procedures"],
    () => ProcedureApi.getAll(),
  );

  return { proceduresQuery };
};

export const useProcedure = (procedureId: number) => {
  const procedureQuery = useQuery<ProcedureResDTO, ApiError>({
    queryKey: ["procedures", procedureId],
    queryFn: () => ProcedureApi.getById(procedureId),
    enabled: !!procedureId,
  });

  return { procedureQuery };
};

export const useCreateProcedure = () => {
  const queryClient = useQueryClient();

  const createProcedureMutation = useMutation<
    ProcedureResDTO,
    ApiError,
    ProcedureReqDTO
  >({
    mutationFn: (procedure) => ProcedureApi.create(procedure),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["procedures"] });
    },
  });

  return { createProcedureMutation };
};

export const useUpdateProcedure = () => {
  const queryClient = useQueryClient();

  const updateProcedureMutation = useMutation<
    ProcedureResDTO,
    Error,
    Procedure
  >({
    mutationFn: (procedure) => ProcedureApi.update(procedure),
    onSuccess: (updatedProcedure) => {
      // Invalidate the procedures query to refetch data
      queryClient.invalidateQueries({ queryKey: ["procedures"] });

      // Alternatively, you could update the cache directly for immediate UI update
      // queryClient.setQueryData(["procedures", updatedProcedure.id], updatedProcedure);
    },
  });

  return { updateProcedureMutation };
};

export const useDeleteProcedure = () => {
  const queryClient = useQueryClient();

  const deleteProcedureMutation = useMutation<void, ApiError, number>({
    mutationFn: (procedureId) => ProcedureApi.delete(procedureId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["procedures"] });
    },
  });

  return { deleteProcedureMutation };
};

export const useProcedureBatch = (ids: number[]) => {
  const procedureBatchQuery = useQuery<ProcedureResDTO[], ApiError>(
    ["patients", "batch", ids],
    () => ProcedureApi.getBatch(ids),
    { enabled: ids.length > 0 },
  );

  return {
    data: procedureBatchQuery.data,
    error: procedureBatchQuery.error,
    isLoading: procedureBatchQuery.isLoading,
    isError: procedureBatchQuery.isError,
  };
};
