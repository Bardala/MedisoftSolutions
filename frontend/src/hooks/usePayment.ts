import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ApiError } from "../fetch/ApiError";
import { PaymentApi, VisitPaymentApi } from "../apis";
import {
  PaymentReqDTO,
  PaymentResDTO,
  VisitPaymentReqDTO,
  VisitPaymentResDTO,
} from "../dto";
import { Payment } from "../types";

export const useRecordPayment = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<PaymentResDTO, ApiError, PaymentReqDTO>(
    (newPayment) => PaymentApi.create(newPayment),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["payments"]);
      },
      onError: (error) => {
        console.error("Error recording payment:", error);
      },
    },
  );

  return { mutation };
};

export const useAddVisitPayment = () => {
  const mutation = useMutation<
    VisitPaymentResDTO,
    ApiError,
    VisitPaymentReqDTO
  >((visitPayment) => VisitPaymentApi.create(visitPayment));

  return { mutation };
};

export const useUpdatePayment = () => {
  const queryClient = useQueryClient();

  const updatePaymentMutation = useMutation<
    PaymentResDTO,
    ApiError,
    PaymentReqDTO
  >((payment) => PaymentApi.update(payment), {
    onSuccess: (_, paymentVariables) => {
      queryClient.invalidateQueries([
        "patient-registry",
        paymentVariables.patientId,
      ]);
      queryClient.invalidateQueries(["payments", "daily payments"]);
    },
  });

  return { updatePaymentMutation };
};

export const useDeletePayment = () => {
  const queryClient = useQueryClient();

  const deletePaymentMutation = useMutation<unknown, ApiError, Payment>(
    (payment) => PaymentApi.delete(payment.id),
    {
      onSuccess: (_, paymentVariables) => {
        queryClient.invalidateQueries(["payments", "daily payments"]);
      },
    },
  );

  return { deletePaymentMutation };
};

export const useGetPaymentBatch = (ids: number[]) => {
  const paymentsBatchQuery = useQuery<PaymentResDTO[], ApiError>(
    ["payments", "batch", ids],
    () => PaymentApi.getBatch(ids),
    { enabled: ids.length > 0 },
  );

  return {
    data: paymentsBatchQuery.data,
    isError: paymentsBatchQuery.isError,
    isLoading: paymentsBatchQuery.isLoading,
    error: paymentsBatchQuery.error,
  };
};

export const useGetDailyPayments = (date: string) => {
  const dailyPaymentQuery = useQuery<PaymentResDTO[], ApiError>(
    ["payments", "daily payments", date],
    () => PaymentApi.getWorkday(date),
    { refetchOnWindowFocus: true },
  );

  return { dailyPaymentQuery };
};
