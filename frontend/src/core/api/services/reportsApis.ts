import { MonthlySummaryRes, MonthlyDayInfo } from "@/dto";
import { ENDPOINT } from "../config/endpoints";
import { fetchFn } from "../http-client/fetchFn";

export const GetMonthlySummaryApi = (year: number, month: number) =>
  fetchFn<void, MonthlySummaryRes>(
    `${ENDPOINT.GET_MONTHLY_SUMMARY}?year=${year}&month=${month}`,
  );

export const GetMonthlyDaysInfoApi = (year: number, month: number) =>
  fetchFn<void, MonthlyDayInfo[]>(
    `${ENDPOINT.GET_MONTHLY_DAYS_INFO}?year=${year}&month=${month}`,
  );
