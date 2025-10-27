import { fetchFn } from "../http-client/fetchFn";
import { ENDPOINT } from "../config/endpoints";
import { VisitPaymentReqDTO, VisitPaymentResDTO } from "@/dto";

// *VisitPayment

export const CreateVisitPaymentApi = (visitPayment: VisitPaymentReqDTO) =>
  fetchFn<VisitPaymentReqDTO, VisitPaymentResDTO>(
    ENDPOINT.POST_VISIT_PAYMENT,
    "POST",
    visitPayment,
  );
export const GetVisitPaymentApi = (patientId: number) =>
  fetchFn<void, VisitPaymentResDTO>(
    ENDPOINT.GET_VISIT_PAYMENT,
    "GET",
    undefined,
    [patientId + ""],
  );

export const VisitPaymentApi = {
  create: (visitPayment: VisitPaymentReqDTO) =>
    fetchFn<VisitPaymentReqDTO, VisitPaymentResDTO>(
      ENDPOINT.POST_VISIT_PAYMENT,
      "POST",
      visitPayment,
    ),

  getByPatient: (patientId: number) =>
    fetchFn<void, VisitPaymentResDTO>(
      ENDPOINT.GET_VISIT_PAYMENT,
      "GET",
      undefined,
      [patientId.toString()],
    ),
};
