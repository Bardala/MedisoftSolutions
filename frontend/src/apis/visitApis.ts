import { fetchFn } from "../fetch";
import { ENDPOINT } from "../fetch/endpoints";
import {
  CreateVisitReq,
  CreateVisitRes,
  WorkdayVisitsReq,
  WorkdayVisitsRes,
  Visit,
  UpdateVisitReq,
  UpdateVisitRes,
  DeleteVisitReq,
  DeleteVisitRes,
} from "../types";

// *visit

export const CreateVisitApi = (visit: CreateVisitReq) =>
  fetchFn<CreateVisitReq, CreateVisitRes>(ENDPOINT.CREATE_VISIT, "POST", visit);

export const WorkDayVisitApi = (date) =>
  fetchFn<WorkdayVisitsReq, WorkdayVisitsRes>(
    `${ENDPOINT.GET_WORKDAY_VISITS}?date=${date}`,
  );

export const UpdateVisitApi = (visit: Visit) =>
  fetchFn<UpdateVisitReq, UpdateVisitRes>(ENDPOINT.UPDATE_VISIT, "PUT", visit);

export const DeleteVisitApi = (visitId: number) =>
  fetchFn<DeleteVisitReq, DeleteVisitRes>(
    ENDPOINT.DELETE_VISIT,
    "DELETE",
    undefined,
    [visitId + ""],
  );
