import { useQuery } from "@tanstack/react-query";
import { ApiError } from "../fetch/ApiError";
import { VisitPaymentApi } from "../apis";
import { VisitPaymentResDTO } from "../dto";

export const useGetVisitPayment = (patientId: number) => {
  const visitPaymentQuery = useQuery<VisitPaymentResDTO, ApiError>(
    ["visit-payments", patientId],
    () => VisitPaymentApi.getByPatient(patientId),
    { enabled: !!patientId },
  );

  return { visitPaymentQuery };
};
