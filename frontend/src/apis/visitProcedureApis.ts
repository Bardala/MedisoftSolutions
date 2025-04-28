import { fetchFn } from "../fetch";
import { ENDPOINT } from "../fetch/endpoints";
import {
  GetVisitProceduresByVisitIdReq,
  GetVisitProceduresByVisitIdRes,
  recordVisitDentalProcedureReq,
  recordVisitDentalProcedureRes,
  UpdateVisitDentalProcedureReq,
  UpdateVisitDentalProcedureRes,
} from "../types";

// *VisitDentalProcedure

export const RecordVisitDentalProcedureApi = (
  visitDentalProcedure: recordVisitDentalProcedureReq,
) =>
  fetchFn<recordVisitDentalProcedureReq, recordVisitDentalProcedureRes>(
    ENDPOINT.POST_VISIT_DENTAL_PROCEDURE,
    "POST",
    visitDentalProcedure,
  );
export const UpdateVisitDentalProcedureApi = (visitDentalProcedureId: number) =>
  fetchFn<UpdateVisitDentalProcedureReq, UpdateVisitDentalProcedureRes>(
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
  fetchFn<GetVisitProceduresByVisitIdReq, GetVisitProceduresByVisitIdRes>(
    ENDPOINT.GET_VISIT_PROCEDURES_BY_VISIT_ID,
    "GET",
    undefined,
    [params.visitId + ""],
  );
