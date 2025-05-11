import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Procedure, GetAllProcedureRes } from "../types";
import {
  GetAllProceduresApi,
  CreateProcedure,
  UpdateProcedure,
  DeleteProcedure,
  GetProcedureById,
} from "../apis";
import { ApiError } from "../fetch/ApiError";

export const useProcedures = () => {
  const proceduresQuery = useQuery<GetAllProcedureRes, ApiError>({
    queryKey: ["procedures"],
    queryFn: () => GetAllProceduresApi(),
  });

  return { proceduresQuery };
};

export const useProcedure = (procedureId: number) => {
  const procedureQuery = useQuery<Procedure, ApiError>({
    queryKey: ["procedure", procedureId],
    queryFn: () => GetProcedureById(procedureId),
    enabled: !!procedureId,
  });

  return { procedureQuery };
};

export const useCreateProcedure = () => {
  const queryClient = useQueryClient();

  const createProcedureMutation = useMutation<Procedure, ApiError, Procedure>({
    mutationFn: (procedure) => CreateProcedure(procedure),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["procedures"] });
    },
  });

  return { createProcedureMutation };
};

export const useUpdateProcedure = () => {
  const queryClient = useQueryClient();

  const updateProcedureMutation = useMutation<Procedure, Error, Procedure>({
    mutationFn: (procedure) => UpdateProcedure(procedure),
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
    mutationFn: (procedureId) => DeleteProcedure(procedureId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["procedures"] });
    },
  });

  return { deleteProcedureMutation };
};
