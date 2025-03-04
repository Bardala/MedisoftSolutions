import { useQuery } from "@tanstack/react-query";
import { GetMonthlySummaryApi, GetMonthlyDaysInfoApi } from "../fetch/api";
import { ApiError } from "../fetch/ApiError";
import {
  MonthlySummaryRes,
  MonthlyDaysInfoRes,
  MonthlyDayInfo,
} from "../types";

export const useMonthlyReport = (year: number, month: number) => {
  const monthlySummaryQuery = useQuery<MonthlySummaryRes, ApiError>(
    ["monthly summary", year, month], // Include year and month in the query key
    () => GetMonthlySummaryApi(year, month), // Pass year and month to the API call
  );

  const monthlyDaysInfoQuery = useQuery<MonthlyDayInfo[], ApiError>(
    ["monthly days info", year, month], // Include year and month in the query key
    () => GetMonthlyDaysInfoApi(year, month), // Pass year and month to the API call
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
