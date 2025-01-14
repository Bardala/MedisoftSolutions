import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreatePaymentApi, CreateVisitPaymentApi } from "../fetch/api";
import {
  CreatePaymentReq,
  CreatePaymentRes,
  CreateVisitPaymentReq,
  CreateVisitPaymentRes,
} from "../types";
import { ApiError } from "../fetch/ERROR";

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
