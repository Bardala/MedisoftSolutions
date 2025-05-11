import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  CreatePaymentReq,
  CreatePaymentRes,
  CreateVisitPaymentReq,
  CreateVisitPaymentRes,
  DeletePaymentRes,
  Payment,
  UpdatePaymentRes,
} from "../types";
import { ApiError } from "../fetch/ApiError";
import {
  CreatePaymentApi,
  CreateVisitPaymentApi,
  UpdatePaymentApi,
  DeletePaymentApi,
} from "../apis";

export const useRecordPayment = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<CreatePaymentRes, ApiError, CreatePaymentReq>(
    (newPayment) => CreatePaymentApi(newPayment),
    {
      onSuccess: (data) => {
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
    CreateVisitPaymentRes,
    ApiError,
    CreateVisitPaymentReq
  >((visitPayment) => CreateVisitPaymentApi(visitPayment));

  return { mutation };
};

export const useUpdatePayment = () => {
  const queryClient = useQueryClient();

  const updatePaymentMutation = useMutation<
    UpdatePaymentRes,
    ApiError,
    Payment
  >((payment) => UpdatePaymentApi(payment), {
    onSuccess: (_, paymentVariables) => {
      queryClient.invalidateQueries([
        "patient-registry",
        paymentVariables.patient.id,
      ]);
      queryClient.invalidateQueries(["daily payments"]);
      queryClient.invalidateQueries(["daily payments summary"]);
    },
  });

  return { updatePaymentMutation };
};

export const useDeletePayment = () => {
  const queryClient = useQueryClient();

  const deletePaymentMutation = useMutation<
    DeletePaymentRes,
    ApiError,
    Payment
  >((payment) => DeletePaymentApi(payment), {
    onSuccess: (_, paymentVariables) => {
      queryClient.invalidateQueries([
        "patient-registry",
        paymentVariables.patient.id,
      ]);
      queryClient.invalidateQueries(["daily payments"]);
      queryClient.invalidateQueries(["daily payments summary"]);
    },
  });

  return { deletePaymentMutation };
};
