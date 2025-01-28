import { useQuery } from "@tanstack/react-query";
import { GetMonthlySummaryApi, GetMonthlyDaysInfoApi } from "../fetch/api";
import { ApiError } from "../fetch/ApiError";
import { MonthlySummaryRes, MonthlyDaysInfoRes } from "../types";

export const useMonthlyReport = () => {
  const monthlySummaryQuery = useQuery<MonthlySummaryRes, ApiError>(
    ["monthly summary"],
    GetMonthlySummaryApi,
  );
  const monthlyDaysInfoQuery = useQuery<MonthlyDaysInfoRes, ApiError>(
    ["monthly days info"],
    GetMonthlyDaysInfoApi,
  );

  return {
    summary: monthlySummaryQuery.data,
    daysInfo: monthlyDaysInfoQuery.data,
    isErrorSummary: monthlySummaryQuery.isError,
    isError: monthlyDaysInfoQuery.isError || monthlySummaryQuery.isError,
    isLoading: monthlyDaysInfoQuery.isLoading || monthlySummaryQuery.isLoading,
    summaryError: monthlySummaryQuery.error,
    daysInfoError: monthlyDaysInfoQuery.error,
  };
};
