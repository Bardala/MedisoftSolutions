import { useQuery } from "@tanstack/react-query";
import { GetVisitPaymentsRes } from "../types";
import { ApiError } from "../fetch/ApiError";
import { GetVisitPaymentApi } from "../fetch/api";

export const useGetVisitPayment = (patientId: number) => {
  const visitPaymentQuery = useQuery<GetVisitPaymentsRes, ApiError>(
    ["visit-payments", patientId],
    () => GetVisitPaymentApi(patientId),
    {
      enabled: !!patientId,
    },
  );

  return { visitPaymentQuery };
};
