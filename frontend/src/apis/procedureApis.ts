import { fetchFn } from "../fetch";
import { ENDPOINT } from "../fetch/endpoints";
import {
  DentalProcedure,
  GetAllDentalProcedureReq,
  GetAllDentalProcedureRes,
} from "../types";

// *DentalProcedure

export const GetAllDentalProceduresApi = () =>
  fetchFn<GetAllDentalProcedureReq, GetAllDentalProcedureRes>(
    ENDPOINT.GET_ALL_DENTAL_PROCEDURES,
  );
export const CreateProcedure = (procedure: DentalProcedure) =>
  fetchFn<DentalProcedure, DentalProcedure>(
    ENDPOINT.CREATE_DENTAL_PROCEDURE,
    "GET",
    procedure,
  );
