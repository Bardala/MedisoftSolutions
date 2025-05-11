import { fetchFn } from "../fetch";
import { ENDPOINT } from "../fetch/endpoints";
import {
  CreateVisitPaymentReq,
  CreateVisitPaymentRes,
  GetVisitPaymentsReq,
  GetVisitPaymentsRes,
} from "../types";

// *VisitPayment

export const CreateVisitPaymentApi = (visitPayment: CreateVisitPaymentReq) =>
  fetchFn<CreateVisitPaymentReq, CreateVisitPaymentRes>(
    ENDPOINT.POST_VISIT_PAYMENT,
    "POST",
    visitPayment,
  );
export const GetVisitPaymentApi = (patientId: number) =>
  fetchFn<GetVisitPaymentsReq, GetVisitPaymentsRes>(
    ENDPOINT.GET_VISIT_PAYMENT,
    "GET",
    undefined,
    [patientId + ""],
  );
