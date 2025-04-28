import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DeleteVisitProcedureRes,
  DentalProcedure,
  GetVisitProceduresByVisitIdReq,
  GetVisitProceduresByVisitIdRes,
  recordVisitDentalProcedureReq,
  recordVisitDentalProcedureRes,
  UpdateVisitDentalProcedureRes,
  VisitDentalProcedure,
} from "../types";
import { ApiError } from "../fetch/ApiError";
import { useState } from "react";
import {
  UpdateVisitDentalProcedureApi,
  RecordVisitDentalProcedureApi,
  DeleteVisitProcedureApi,
  GetVisitProceduresByVisitIdApi,
} from "../apis";

export const useUpdateVisitDentalProcedure = () => {
  const updateVisitDentalProcedureMutation = useMutation<
    UpdateVisitDentalProcedureRes,
    ApiError,
    number
  >((visitDentalProcedureId) =>
    UpdateVisitDentalProcedureApi(visitDentalProcedureId),
  );

  return { updateVisitDentalProcedureMutation };
};

export const useRecordVisitDentalProcedure = () => {
  const recordVisitDentalProcedureMutation = useMutation<
    recordVisitDentalProcedureRes,
    ApiError,
    recordVisitDentalProcedureReq
  >((visitDentalProcedure) =>
    RecordVisitDentalProcedureApi(visitDentalProcedure),
  );

  return { recordVisitDentalProcedureMutation };
};

export const useRecordVisitsProcedures = () => {
  const queryClient = useQueryClient();

  const { recordVisitDentalProcedureMutation } =
    useRecordVisitDentalProcedure();
  const [selectedDentalProcedures, setSelectedDentalProcedures] = useState<
    DentalProcedure[]
  >([]);

  const handleDentalProcedureSelect = (dentalProcedure: DentalProcedure) => {
    setSelectedDentalProcedures((prev) => [...prev, dentalProcedure]);
  };

  const handleRecordVisitProcedures = async (visitId: number) =>
    await Promise.all(
      selectedDentalProcedures.map((dentalProcedure) =>
        recordVisitDentalProcedureMutation.mutateAsync(
          {
            visit: { id: visitId },
            dentalProcedure: {
              id: dentalProcedure.id,
            },
          },
          {
            onSuccess: () =>
              queryClient.invalidateQueries(["visit-procedures", visitId]),
          },
        ),
      ),
    );

  return {
    handleDentalProcedureSelect,
    selectedDentalProcedures,
    setSelectedDentalProcedures,
    handleRecordVisitProcedures,
  };
};

export const useDeleteVisitProcedure = () => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation<
    DeleteVisitProcedureRes,
    ApiError,
    VisitDentalProcedure
  >((vp) => DeleteVisitProcedureApi({ procedureId: vp.id }), {
    onSuccess: (_, vpVariables) =>
      queryClient.invalidateQueries(["visit-procedures", vpVariables.visit.id]),
  });

  return { deleteMutation };
};

export const useGetVisitProceduresByVisitId = (visitId: number) => {
  const query = useQuery<
    GetVisitProceduresByVisitIdRes,
    ApiError,
    GetVisitProceduresByVisitIdReq
  >(
    ["visit-procedures", visitId],
    () => GetVisitProceduresByVisitIdApi({ visitId }),
    { enabled: !!visitId },
  );

  return { query };
};
