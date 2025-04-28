import { useQuery } from "@tanstack/react-query";

import { ApiError } from "../fetch/ApiError";
import {
  WorkdayPaymentsRes,
  WorkdayVisitsRes,
  DailyNewPatientsRes,
  Patient,
  Visit,
  Payment,
} from "../types";
import { sortById } from "../utils/sort";
import {
  WorkdayPaymentsApi,
  WorkDayVisitApi,
  DailyNewPatientsApi,
} from "../apis";

export const useDailyReportData = (
  date = new Date().toISOString().split("T")[0],
) => {
  const dailyPaymentQuery = useQuery<WorkdayPaymentsRes, ApiError>(
    ["daily payments", date],
    () => WorkdayPaymentsApi(date),
  );

  const dailyVisitsQuery = useQuery<WorkdayVisitsRes, ApiError>(
    ["daily visits", date],
    () => WorkDayVisitApi(date),
  );

  const dailyNewPatientsQuery = useQuery<DailyNewPatientsRes, ApiError>(
    ["daily new patients", date],
    () => DailyNewPatientsApi(date),
  );

  const payments = sortById(dailyPaymentQuery.data) as unknown as Payment[];
  const totalPayments = payments?.reduce((acc, p) => acc + p.amount, 0);

  return {
    patients: sortById(dailyNewPatientsQuery.data) as unknown as Patient[],
    visits: sortById(dailyVisitsQuery.data) as unknown as Visit[],
    payments,
    // paymentsSummary: dailyPaymentSummaryQuery.data,
    totalPayments,

    isLoading:
      dailyNewPatientsQuery.isLoading ||
      dailyPaymentQuery.isLoading ||
      dailyVisitsQuery.isLoading,
    isError:
      dailyNewPatientsQuery.isError ||
      dailyPaymentQuery.isError ||
      dailyVisitsQuery.isError,
  };
};
