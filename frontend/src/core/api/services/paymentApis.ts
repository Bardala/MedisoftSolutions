import { PaymentReqDTO, PaymentResDTO, WorkdayPaymentsSummaryRes } from "@/dto";
import { ENDPOINT } from "../config/endpoints";
import { fetchFn } from "../http-client/fetchFn";

export const CreatePaymentApi = (payment: PaymentReqDTO) =>
  fetchFn<PaymentReqDTO, PaymentResDTO>(
    ENDPOINT.CREATE_PAYMENT,
    "POST",
    payment,
  );

export const WorkdayPaymentsApi = (date) =>
  fetchFn<void, PaymentResDTO[]>(
    `${ENDPOINT.GET_WORKDAY_PAYMENTS}?date=${date}`,
  );

export const WorkdayPaymentsSummaryApi = () =>
  fetchFn<void, WorkdayPaymentsSummaryRes>(
    ENDPOINT.GET_WORKDAY_PAYMENTS_SUMMARY,
  );

export const UpdatePaymentApi = (payment: PaymentReqDTO, id: number) =>
  fetchFn<PaymentReqDTO, PaymentResDTO>(
    ENDPOINT.UPDATE_PAYMENT,
    "PUT",
    payment,
    [id.toString()],
  );

export const DeletePaymentApi = (paymentId: number) =>
  fetchFn<void, void>(ENDPOINT.DELETE_PAYMENT, "DELETE", undefined, [
    paymentId + "",
  ]);

export const GetPaymentBatch = (ids: number[]) =>
  fetchFn<void, PaymentResDTO[]>(
    `${ENDPOINT.PAYMENT_BATCH}?ids=${ids.join(",")}`,
    "GET",
  );

export const PaymentApi = {
  create: (payment: PaymentReqDTO) =>
    fetchFn<PaymentReqDTO, PaymentResDTO>(
      ENDPOINT.CREATE_PAYMENT,
      "POST",
      payment,
    ),

  getWorkday: (date: string) =>
    fetchFn<void, PaymentResDTO[]>(
      `${ENDPOINT.GET_WORKDAY_PAYMENTS}?date=${date}`,
    ),

  getWorkdaySummary: () =>
    fetchFn<void, WorkdayPaymentsSummaryRes>(
      ENDPOINT.GET_WORKDAY_PAYMENTS_SUMMARY,
    ),

  update: (payment: PaymentReqDTO, id: number) =>
    fetchFn<PaymentReqDTO, PaymentResDTO>(
      ENDPOINT.UPDATE_PAYMENT,
      "PUT",
      payment,
      [id.toString()],
    ),

  delete: (paymentId: number) =>
    fetchFn<void, void>(ENDPOINT.DELETE_PAYMENT, "DELETE", undefined, [
      paymentId.toString(),
    ]),

  getBatch: (ids: number[]) =>
    fetchFn<void, PaymentResDTO[]>(
      `${ENDPOINT.PAYMENT_BATCH}?ids=${ids.join(",")}`,
      "GET",
    ),
};
