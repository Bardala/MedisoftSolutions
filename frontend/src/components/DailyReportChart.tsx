import { useDailyReportData } from "../hooks/useDailyReportData";
import { HourlyVisitChart } from "./HourlyVisitChart";

export const DailyReportCharts = ({ date }: { date: string }) => {
  const { visits, isLoading, isError } = useDailyReportData(date);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading data</p>;

  return (
    <div>
      <HourlyVisitChart visits={visits} />
    </div>
  );
};
