import { VisitReqDTO, VisitResDTO } from "../dto";
import { fetchFn } from "../fetch";
import { ENDPOINT } from "../fetch/endpoints";

// *visit

export const CreateVisitApi = (visit: VisitReqDTO) =>
  fetchFn<VisitReqDTO, VisitResDTO>(ENDPOINT.CREATE_VISIT, "POST", visit);

export const WorkDayVisitApi = (date) =>
  fetchFn<void, VisitResDTO[]>(`${ENDPOINT.GET_WORKDAY_VISITS}?date=${date}`);

export const UpdateVisitApi = (visit: VisitReqDTO) =>
  fetchFn<VisitReqDTO, VisitResDTO>(ENDPOINT.UPDATE_VISIT, "PUT", visit);

export const DeleteVisitApi = (visitId: number) =>
  fetchFn(ENDPOINT.DELETE_VISIT, "DELETE", undefined, [visitId + ""]);

export const GetVisitBatch = (ids: number[]) =>
  fetchFn<void, VisitResDTO[]>(
    `${ENDPOINT.VISIT_BATCH}?ids=${ids.join(",")}`,
    "GET",
  );

export const VisitApi = {
  create: (visit: VisitReqDTO) =>
    fetchFn<VisitReqDTO, VisitResDTO>(ENDPOINT.CREATE_VISIT, "POST", visit),

  getWorkday: (date: string) =>
    fetchFn<void, VisitResDTO[]>(`${ENDPOINT.GET_WORKDAY_VISITS}?date=${date}`),

  update: (visit: VisitReqDTO) =>
    fetchFn<VisitReqDTO, VisitResDTO>(ENDPOINT.UPDATE_VISIT, "PUT", visit),

  delete: (visitId: number) =>
    fetchFn<void, void>(ENDPOINT.DELETE_VISIT, "DELETE", undefined, [
      visitId.toString(),
    ]),

  getBatch: (ids: number[]) =>
    fetchFn<void, VisitResDTO[]>(
      `${ENDPOINT.VISIT_BATCH}?ids=${ids.join(",")}`,
      "GET",
    ),

  getByDay: (date: string) =>
    fetchFn<void, VisitResDTO[]>(ENDPOINT.GET_DAILY_SCHEDULE + `?date=${date}`),

  getByWeek: (startDate: string) =>
    fetchFn<void, VisitResDTO[]>(
      ENDPOINT.GET_WEEKLY_SCHEDULE + `?startDate=${startDate}`,
    ),
};
