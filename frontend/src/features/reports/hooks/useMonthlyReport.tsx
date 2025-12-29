import { GetMonthlySummaryApi, GetMonthlyDaysInfoApi } from "@/core";
import { MonthlySummaryRes, ApiError, MonthlyDayInfo } from "@/shared";
import { useQuery } from "@tanstack/react-query";

export const useMonthlyReport = (year: number, month: number) => {
  const monthlySummaryQuery = useMonthlySummary(year, month);

  const monthlyDaysInfoQuery = useMonthlyDaysInfo(year, month);

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

export const useMonthlySummary = (
  year: number = new Date().getFullYear(),
  month: number = new Date().getMonth() + 1,
) =>
  useQuery<MonthlySummaryRes, ApiError>(["monthly summary", year, month], () =>
    GetMonthlySummaryApi(year, month),
  );

export const useMonthlyDaysInfo = (year: number, month: number) => {
  return useQuery<MonthlyDayInfo[], ApiError>(
    ["monthly days info", year, month],
    () => GetMonthlyDaysInfoApi(year, month),
  );
};
