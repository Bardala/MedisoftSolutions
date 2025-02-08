import { useQuery } from "@tanstack/react-query";
import {
  WorkdayPaymentsApi,
  WorkdayPaymentsSummaryApi,
  WorkDayVisitApi,
  DailyNewPatients as DailyNewPatientsApi,
} from "../fetch/api";
import { ApiError } from "../fetch/ApiError";
import {
  WorkdayPaymentsRes,
  WorkdayPaymentsSummaryRes,
  WorkdayVisitsRes,
  DailyNewPatientsRes,
  Patient,
  Visit,
  Payment,
} from "../types";
import { sortById } from "../utils/sort";

export const useDailyReportData = () => {
  const dailyPaymentQuery = useQuery<WorkdayPaymentsRes, ApiError>(
    ["daily payments"],
    WorkdayPaymentsApi,
    {
      // refetchInterval: 500,
      // refetchIntervalInBackground: true,
    },
  );

  const dailyPaymentSummaryQuery = useQuery<
    WorkdayPaymentsSummaryRes,
    ApiError
  >(["daily payments summary"], WorkdayPaymentsSummaryApi);

  const dailyVisitsQuery = useQuery<WorkdayVisitsRes, ApiError>(
    ["daily visits"],
    WorkDayVisitApi,
    // { refetchInterval: 500 },
  );

  const dailyNewPatientsQuery = useQuery<DailyNewPatientsRes, ApiError>(
    ["daily new patients"],
    DailyNewPatientsApi,
    // { refetchInterval: 500 },
  );

  const payments = sortById(dailyPaymentQuery.data) as unknown as Payment[];
  const totalPayments = payments?.reduce((acc, p) => acc + p.amount, 0);

  return {
    patients: sortById(dailyNewPatientsQuery.data) as unknown as Patient[],
    visits: sortById(dailyVisitsQuery.data) as unknown as Visit[],
    payments,
    paymentsSummary: dailyPaymentSummaryQuery.data,
    totalPayments,

    isLoading:
      dailyNewPatientsQuery.isLoading ||
      dailyPaymentQuery.isLoading ||
      dailyVisitsQuery.isLoading ||
      dailyPaymentSummaryQuery.isLoading,
    isError:
      dailyNewPatientsQuery.isError ||
      dailyPaymentQuery.isError ||
      dailyPaymentSummaryQuery.isError ||
      dailyVisitsQuery.isError,
  };
};
