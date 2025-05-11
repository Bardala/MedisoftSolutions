import { fetchFn } from "../fetch";
import { ENDPOINT } from "../fetch/endpoints";
import { Procedure, GetAllProcedureReq, GetAllProcedureRes } from "../types";

export const GetAllProceduresApi = () =>
  fetchFn<GetAllProcedureReq, GetAllProcedureRes>(
    ENDPOINT.GET_ALL_DENTAL_PROCEDURES,
  );

export const CreateProcedure = (procedure: Procedure) =>
  fetchFn<Procedure, Procedure>(
    ENDPOINT.CREATE_DENTAL_PROCEDURE,
    "POST",
    procedure,
  );

export const UpdateProcedure = (procedure: Procedure) =>
  fetchFn<Procedure, Procedure>(
    ENDPOINT.UPDATE_DENTAL_PROCEDURE,
    "PUT",
    procedure,
    [procedure.id + ""],
  );

export const DeleteProcedure = (procedureId: number) =>
  fetchFn<void, void>(ENDPOINT.DELETE_DENTAL_PROCEDURE, "DELETE", undefined, [
    procedureId + "",
  ]);

export const GetProcedureById = (procedureId: number) =>
  fetchFn<void, Procedure>(
    ENDPOINT.GET_DENTAL_PROCEDURE_BY_ID,
    "GET",
    undefined,
    [procedureId + ""],
  );
