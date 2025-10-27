import { VisitPaymentApi } from "@/core";
import { VisitPaymentResDTO } from "@/dto";
import { ApiError } from "@/shared";
import { useQuery } from "@tanstack/react-query";

export const useGetVisitPayment = (patientId: number) => {
  const visitPaymentQuery = useQuery<VisitPaymentResDTO, ApiError>(
    ["visit-payments", patientId],
    () => VisitPaymentApi.getByPatient(patientId),
    { enabled: !!patientId },
  );

  return { visitPaymentQuery };
};
