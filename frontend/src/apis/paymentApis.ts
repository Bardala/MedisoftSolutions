import { fetchFn } from "../fetch";
import { ENDPOINT } from "../fetch/endpoints";
import {
  CreatePaymentReq,
  CreatePaymentRes,
  WorkdayPaymentsReq,
  WorkdayPaymentsRes,
  WorkdayPaymentsSummaryReq,
  WorkdayPaymentsSummaryRes,
  Payment,
  UpdatePaymentReq,
  UpdatePaymentRes,
  DeletePaymentReq,
  DeletePaymentRes,
} from "../types";

// *payment

export const CreatePaymentApi = (payment: CreatePaymentReq) =>
  fetchFn<CreatePaymentReq, CreatePaymentRes>(
    ENDPOINT.CREATE_PAYMENT,
    "POST",
    payment,
  );

export const WorkdayPaymentsApi = (date) =>
  fetchFn<WorkdayPaymentsReq, WorkdayPaymentsRes>(
    `${ENDPOINT.GET_WORKDAY_PAYMENTS}?date=${date}`,
  );

export const WorkdayPaymentsSummaryApi = () =>
  fetchFn<WorkdayPaymentsSummaryReq, WorkdayPaymentsSummaryRes>(
    ENDPOINT.GET_WORKDAY_PAYMENTS_SUMMARY,
  );

export const UpdatePaymentApi = (payment: Payment) =>
  fetchFn<UpdatePaymentReq, UpdatePaymentRes>(
    ENDPOINT.UPDATE_PAYMENT,
    "PUT",
    payment,
  );

export const DeletePaymentApi = (payment: Payment) =>
  fetchFn<DeletePaymentReq, DeletePaymentRes>(
    ENDPOINT.DELETE_PAYMENT,
    "DELETE",
    undefined,
    [payment.id + ""],
  );
