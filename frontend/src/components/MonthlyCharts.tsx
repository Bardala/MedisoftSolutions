import { useIntl } from "react-intl";
import { Bar, Line } from "react-chartjs-2";
import { FC } from "react";
import {
  LineElement,
  PointElement,
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartOptions,
} from "chart.js";
import { MonthlyDayInfo, MonthlySummaryRes } from "../types";

ChartJS.register(
  LineElement,
  PointElement,
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

  const sortedDays = [...daysInfo].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  const chartDescriptions = {
    revenue: formatMessage({
      id: "revenue_chart_description",
      defaultMessage:
        "Shows daily income trends. Peaks indicate high-revenue days, valleys show slower periods. Compare with visits to understand patient spending patterns.",
    }),
    visits: formatMessage({
      id: "visits_chart_description",
      defaultMessage:
        "Displays patient visit frequency. Taller bars mean busier days. Helps with staff scheduling and identifying peak demand periods.",
    }),
  };

  // const dailyRevenueData = {
  //   labels: sortedDays.map((day) => new Date(day.date).getDate().toString()),
  //   datasets: [
  //     {
  //       label: formatMessage({ id: "daily_revenue" }),
  //       data: sortedDays.map((day) => day.totalRevenue),
  //       borderColor: "rgba(75, 192, 192, 1)",
  //       backgroundColor: "rgba(75, 192, 192, 0.2)",
  //       tension: 0.4,
  //       fill: true,
  //     },
  //   ],
  // };

  const dailyVisitsData = {
    labels: sortedDays.map((day) => new Date(day.date).getDate().toString()),
    datasets: [
      {
        label: formatMessage({ id: "daily_visits" }),
        data: sortedDays.map((day) => day.totalVisits),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  };

  // const lineOptions = {
  //   responsive: true,
  //   plugins: {
  //     legend: { position: "top" } as const,
  //     title: {
  //       display: true,
  //       text: chartDescriptions.revenue, // Title on top of the chart
  //     },
  //   },
  //   scales: {
  //     x: {
  //       title: {
  //         display: true,
  //         text: formatMessage({ id: "date" }),
  //       },
  //     },
  //     y: {
  //       title: {
  //         display: true,
  //         text: formatMessage({ id: "amount" }),
  //       },
  //     },
  //   },
  // };

  const barOptoins = {
    responsive: true,
    plugins: {
      legend: { position: "top" } as const,
      title: {
        display: true,
        text: chartDescriptions.visits, // Title on top of the chart
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: formatMessage({ id: "date" }),
        },
      },
      y: {
        title: {
          display: true,
          text: formatMessage({ id: "y_axis_label" }),
        },
      },
    },
  };

  const combinedLineData = {
    labels: sortedDays.map((day) => new Date(day.date).getDate().toString()),
    datasets: [
      {
        label: formatMessage({ id: "daily_revenue" }),
        data: sortedDays.map((day) => day.totalRevenue),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
        fill: false,
        yAxisID: "y", // attach to left axis
      },
      {
        label: formatMessage({ id: "daily_visits" }),
        data: sortedDays.map((day) => day.totalVisits),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
        fill: false,
        yAxisID: "y1", // attach to right axis for clarity
      },
    ],
  };

  const combinedLineOptions: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: formatMessage({
          id: "combined_chart_description",
          defaultMessage: "Daily Revenue and Visit Trends",
        }),
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: formatMessage({ id: "date" }),
        },
      },
      y: {
        type: "linear" as const,
        display: true,
        position: "left",
        title: {
          display: true,
          text: formatMessage({ id: "amount" }),
        },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right",
        title: {
          display: true,
          text: formatMessage({ id: "visits" }),
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    isData && (
      <>
        {/* Revenue Trend */}
        <div className="chart-card p-4 shadow rounded bg-white dark:bg-gray-800 col-span-1 md:col-span-2">
          <h3 className="text-lg font-semibold mb-2">
            {formatMessage({ id: "daily_revenue" })}
          </h3>

          {/* <Line data={dailyRevenueData} options={lineOptions} /> */}
          <Line data={combinedLineData} options={combinedLineOptions} />
        </div>

        {/* Visit Frequency */}
        <div className="chart-card p-4 shadow rounded bg-white dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-2">
            {formatMessage({ id: "monthly_visits" })}
          </h3>

          <Bar data={dailyVisitsData} options={barOptoins} />
        </div>
      </>
    )
  );
};
