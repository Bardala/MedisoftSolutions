import { ProcedureReqDTO, ProcedureResDTO } from "../dto";
import { fetchFn } from "../fetch";
import { ENDPOINT } from "../fetch/endpoints";
import { Procedure } from "../types";

export const GetAllProceduresApi = () =>
  fetchFn<void, ProcedureResDTO[]>(ENDPOINT.GET_ALL_DENTAL_PROCEDURES);

export const CreateProcedure = (procedure: ProcedureReqDTO) =>
  fetchFn<ProcedureReqDTO, ProcedureResDTO>(
    ENDPOINT.CREATE_DENTAL_PROCEDURE,
    "POST",
    procedure,
  );

export const UpdateProcedure = (procedure: Procedure) =>
  fetchFn<ProcedureReqDTO, ProcedureResDTO>(
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
  fetchFn<void, ProcedureResDTO>(
    ENDPOINT.GET_DENTAL_PROCEDURE_BY_ID,
    "GET",
    undefined,
    [procedureId + ""],
  );

export const GetProcedureBatch = (ids: number[]) =>
  fetchFn<void, ProcedureResDTO[]>(
    `${ENDPOINT.PROCEDURE_BATCH}?ids=${ids.join(",")}`,
    "GET",
  );

export const ProcedureApi = {
  getAll: () =>
    fetchFn<void, ProcedureResDTO[]>(ENDPOINT.GET_ALL_DENTAL_PROCEDURES),

  create: (procedure: ProcedureReqDTO) =>
    fetchFn<ProcedureReqDTO, ProcedureResDTO>(
      ENDPOINT.CREATE_DENTAL_PROCEDURE,
      "POST",
      procedure,
    ),

  update: (procedure: Procedure) =>
    fetchFn<ProcedureReqDTO, ProcedureResDTO>(
      ENDPOINT.UPDATE_DENTAL_PROCEDURE,
      "PUT",
      procedure,
      [procedure.id.toString()],
    ),

  delete: (procedureId: number) =>
    fetchFn<void, void>(ENDPOINT.DELETE_DENTAL_PROCEDURE, "DELETE", undefined, [
      procedureId.toString(),
    ]),

  getById: (procedureId: number) =>
    fetchFn<void, ProcedureResDTO>(
      ENDPOINT.GET_DENTAL_PROCEDURE_BY_ID,
      "GET",
      undefined,
      [procedureId.toString()],
    ),

  getBatch: (ids: number[]) =>
    fetchFn<void, ProcedureResDTO[]>(
      `${ENDPOINT.PROCEDURE_BATCH}?ids=${ids.join(",")}`,
      "GET",
    ),
};
