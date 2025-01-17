import { useQuery } from "@tanstack/react-query";
import {
  WorkdayPaymentsApi,
  WorkdayPaymentsSummaryApi,
  WorkDayVisitApi,
  DailyNewPatients as DailyNewPatientsApi,
} from "../fetch/api";
import { ApiError } from "../fetch/ERROR";
import {
  WorkdayPaymentsRes,
  WorkdayPaymentsSummaryRes,
  WorkdayVisitsRes,
  DailyNewPatientsRes,
  Patient,
  Visit,
  Payment,
} from "../types";

export const useDailyReportData = () => {
  const dailyPaymentQuery = useQuery<WorkdayPaymentsRes, ApiError>(
    ["daily payments"],
    WorkdayPaymentsApi,
    {
      // refetchInterval: 500,
      refetchIntervalInBackground: true,
    },
  );

  const dailyPaymentSummaryQuery = useQuery<
    WorkdayPaymentsSummaryRes,
    ApiError
  >(["daily payments summary"], WorkdayPaymentsSummaryApi);

  const dailyVisitsQuery = useQuery<WorkdayVisitsRes, ApiError>(
    ["daily visits"],
    WorkDayVisitApi,
    { refetchInterval: 500 },
  );

  const dailyNewPatientsQuery = useQuery<DailyNewPatientsRes, ApiError>(
    ["daily new patients"],
    DailyNewPatientsApi,
    { refetchInterval: 500 },
  );

  return {
    patients: dailyNewPatientsQuery.data as unknown as Patient[],
    visits: dailyVisitsQuery.data as unknown as Visit[],
    payments: dailyPaymentQuery.data as unknown as Payment[],
    paymentsSummary: dailyPaymentSummaryQuery.data,

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
