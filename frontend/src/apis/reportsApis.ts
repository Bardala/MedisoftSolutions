import { fetchFn } from "../fetch";
import { ENDPOINT } from "../fetch/endpoints";
import { MonthlySummaryReq, MonthlySummaryRes, MonthlyDayInfo } from "../types";

// *Monthly Report

export const GetMonthlySummaryApi = (year: number, month: number) =>
  fetchFn<MonthlySummaryReq, MonthlySummaryRes>(
    `${ENDPOINT.GET_MONTHLY_SUMMARY}?year=${year}&month=${month}`,
  );

export const GetMonthlyDaysInfoApi = (year: number, month: number) =>
  fetchFn<void, MonthlyDayInfo[]>(
    `${ENDPOINT.GET_MONTHLY_DAYS_INFO}?year=${year}&month=${month}`,
  );
