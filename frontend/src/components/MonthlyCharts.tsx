import { useIntl } from "react-intl";
import { Bar, Line, Pie } from "react-chartjs-2";
import { FC } from "react";
import { LineElement, PointElement } from "chart.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { MonthlyDayInfo, MonthlySummaryRes } from "../types";

ChartJS.register(
  LineElement,
  PointElement,
  // already registered:
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
);

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

interface MonthlyReportProps {
  month: number;
  year: number;
  daysInfo: MonthlyDayInfo[];
  summary: MonthlySummaryRes;
}

export const MonthlyCharts: FC<MonthlyReportProps> = ({
  month,
  year,
  daysInfo,
  summary,
}) => {
  const { formatMessage } = useIntl();
  const isData = daysInfo && summary;

  const dailyRevenueData = {
    labels: daysInfo?.map((day) => new Date(day.date).toLocaleDateString()),
    datasets: [
      {
        label: formatMessage({ id: "daily_revenue" }),
        data: daysInfo?.map((day) => day.totalRevenue),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const dailyVisitsData = {
    labels: daysInfo?.map((day) => new Date(day.date).toLocaleDateString()),
    datasets: [
      {
        label: formatMessage({ id: "daily_visits" }),
        data: isData && daysInfo?.map((day) => day.totalVisits),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  };

  const mostCommonProcedureData = {
    labels: [summary?.mostCommonProcedure || formatMessage({ id: "no_data" })],
    datasets: [
      {
        label: formatMessage({ id: "common_procedures" }),
        data: [1], // Just a representation; consider enhancing this with real frequency distribution if available
        backgroundColor: ["#FF6384"],
      },
    ],
  };

  const baseOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" } as const,
    },
  };

  return (
    isData && (
      <>
        {/* Visits by Hour */}
        <div className="chart-card p-4 shadow rounded bg-white dark:bg-gray-800 col-span-1 md:col-span-2">
          <h3 className="text-lg font-semibold mb-2">
            {formatMessage({ id: "visits_by_hour" })}
          </h3>
          <Line data={dailyRevenueData} options={baseOptions} />
        </div>

        {/* Visits */}
        <div className="chart-card p-4 shadow rounded bg-white dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-2">
            {formatMessage({ id: "monthly_visits" })}
          </h3>
          <Bar data={dailyVisitsData} options={baseOptions} />
        </div>

        {/* Procedure Types */}
        <div className="chart-card p-4 shadow rounded bg-white dark:bg-gray-800 col-span-1 md:col-span-2">
          <h3 className="text-lg font-semibold mb-2">
            {formatMessage({ id: "procedure_frequency" })}
          </h3>
          <Pie data={mostCommonProcedureData} options={baseOptions} />
        </div>
      </>
    )
  );
};
