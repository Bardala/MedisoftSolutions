import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Procedure, VisitDentalProcedure } from "../types";
import { ApiError } from "../fetch/ApiError";
import { useState } from "react";
import { VisitProcedureApi } from "../apis";
import { VisitProcedureReqDTO, VisitProcedureResDTO } from "../dto";

export const useUpdateVisitDentalProcedure = () => {
  const updateVisitDentalProcedureMutation = useMutation<
    VisitProcedureResDTO,
    ApiError,
    number
  >((visitDentalProcedureId) =>
    VisitProcedureApi.update(visitDentalProcedureId),
  );

  return { updateVisitDentalProcedureMutation };
};

export const useRecordVisitDentalProcedure = () => {
  const recordVisitDentalProcedureMutation = useMutation<
    VisitProcedureResDTO,
    ApiError,
    VisitProcedureReqDTO
  >((visitDentalProcedure) => VisitProcedureApi.create(visitDentalProcedure));

  return { recordVisitDentalProcedureMutation };
};

export const useRecordVisitsProcedures = () => {
  const queryClient = useQueryClient();

  const { recordVisitDentalProcedureMutation } =
    useRecordVisitDentalProcedure();
  const [selectedDentalProcedures, setSelectedDentalProcedures] = useState<
    Procedure[]
  >([]);

  const handleDentalProcedureSelect = (dentalProcedure: Procedure) => {
    setSelectedDentalProcedures((prev) => [...prev, dentalProcedure]);
  };

  const handleRecordVisitProcedures = async (visitId: number) =>
    await Promise.all(
      selectedDentalProcedures.map((dentalProcedure) =>
        recordVisitDentalProcedureMutation.mutateAsync(
          {
            visitId,
            procedureId: dentalProcedure.id,
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

  const deleteMutation = useMutation<unknown, ApiError, number>(
    (vpId) => VisitProcedureApi.delete(vpId),
    // {
    //   onSuccess: (_, vpVariables) =>
    //     queryClient.invalidateQueries([
    //       "visit-procedures",
    //       vpVariables.visit.id,
    //     ]),
    // },
  );

  return { deleteMutation };
};

export const useGetVisitProceduresByVisitId = (visitId: number) => {
  const query = useQuery<VisitProcedureResDTO[], ApiError>(
    ["visit-procedures", visitId],
    () => VisitProcedureApi.getByVisit(visitId),
    { enabled: !!visitId },
  );

  return { query };
};
