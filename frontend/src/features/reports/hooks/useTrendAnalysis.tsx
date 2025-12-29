import { useDailyReportData } from "./useDailyReportData";
import { subDays, format } from "date-fns";

export const useTrendAnalysis = () => {
  // Today's data
  const today = new Date().toISOString().split("T")[0];
  const {
    patients: todayPatients,
    visits: todayVisits,
    payments: todayPayments,
    totalPayments: todayTotalPayments,
  } = useDailyReportData(today);

  // Yesterday's data
  const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");
  const {
    patients: yesterdayPatients,
    visits: yesterdayVisits,
    payments: yesterdayPayments,
    totalPayments: yesterdayTotalPayments,
  } = useDailyReportData(yesterday);

  // Calculate trend percentages
  const calculateTrend = (
    currentValue: number,
    previousValue: number,
  ): string => {
    if (previousValue === 0) {
      return currentValue > 0 ? "+100%" : "0%";
    }
    const percentage = ((currentValue - previousValue) / previousValue) * 100;
    const sign = percentage > 0 ? "+" : "";
    return `${sign}${percentage.toFixed(0)}%`;
  };

  return {
    // Patient trend
    patientsTrend: calculateTrend(
      todayPatients?.length || 0,
      yesterdayPatients?.length || 0,
    ),
    // Visits trend
    visitsTrend: calculateTrend(
      todayVisits?.length || 0,
      yesterdayVisits?.length || 0,
    ),
    // Revenue trend
    revenueTrend: calculateTrend(
      todayTotalPayments || 0,
      yesterdayTotalPayments || 0,
    ),
    // Appointments trend (count-based, shows change in number)
    appointmentsTrendCount:
      (todayVisits?.length || 0) - (yesterdayVisits?.length || 0),
  };
};
