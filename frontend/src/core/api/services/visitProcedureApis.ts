import { fetchFn } from "../http-client/fetchFn";
import { ENDPOINT } from "../config/endpoints";
import { VisitProcedureReqDTO, VisitProcedureResDTO } from "@/dto";

export const RecordVisitDentalProcedureApi = (
  visitDentalProcedure: VisitProcedureReqDTO,
) =>
  fetchFn<VisitProcedureReqDTO, VisitProcedureResDTO>(
    ENDPOINT.POST_VISIT_DENTAL_PROCEDURE,
    "POST",
    visitDentalProcedure,
  );

export const UpdateVisitDentalProcedureApi = (visitDentalProcedureId: number) =>
  fetchFn<void, VisitProcedureResDTO>(
    ENDPOINT.UPDATE_VISIT_DENTALPROCEDURE,
    "PUT",
    undefined,
    [visitDentalProcedureId + ""],
  );

export const DeleteVisitProcedureApi = (param: { procedureId: number }) =>
  fetchFn(ENDPOINT.DELETE_VISIT_PROCEDURE, "DELETE", undefined, [
    param.procedureId + "",
  ]);

export const GetVisitProceduresByVisitIdApi = (params: { visitId: number }) =>
  fetchFn<void, VisitProcedureResDTO[]>(
    ENDPOINT.GET_VISIT_PROCEDURES_BY_VISIT_ID,
    "GET",
    undefined,
    [params.visitId + ""],
  );

export const VisitProcedureApi = {
  create: (visitProcedure: VisitProcedureReqDTO) =>
    fetchFn<VisitProcedureReqDTO, VisitProcedureResDTO>(
      ENDPOINT.POST_VISIT_DENTAL_PROCEDURE,
      "POST",
      visitProcedure,
    ),

  update: (visitDentalProcedureId: number) =>
    fetchFn<void, VisitProcedureResDTO>(
      ENDPOINT.UPDATE_VISIT_DENTALPROCEDURE,
      "PUT",
      undefined,
      [visitDentalProcedureId.toString()],
    ),

  delete: (procedureId: number) =>
    fetchFn<void, void>(ENDPOINT.DELETE_VISIT_PROCEDURE, "DELETE", undefined, [
      procedureId.toString(),
    ]),

  getByVisit: (visitId: number) =>
    fetchFn<void, VisitProcedureResDTO[]>(
      ENDPOINT.GET_VISIT_PROCEDURES_BY_VISIT_ID,
      "GET",
      undefined,
      [visitId.toString()],
    ),
};
