import { Line } from "react-chartjs-2";
import { getHourlyVisitDensity } from "../utils/chartUtils";
import { Visit } from "../types";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useIntl } from "react-intl";

// Register ChartJS components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
);

export const HourlyVisitChart = ({ visits }: { visits: Visit[] }) => {
  const { formatMessage: f } = useIntl();
  const hourlyData = getHourlyVisitDensity(visits);
  const visitValues = Object.values(hourlyData);
  const maxVisits = Math.max(...visitValues, 1); // Ensure at least 1

  const data = {
    labels: Object.keys(hourlyData),
    datasets: [
      {
        label: f({ id: "visit_label" }),

        data: visitValues,
        borderColor: "#4F46E5",
        backgroundColor: "rgba(79, 70, 229, 0.2)",
        borderWidth: 2,
        tension: 0.3,
        fill: true,
        pointBackgroundColor: "#4F46E5",
        pointBorderColor: "#fff",
        pointHoverRadius: 6,
        pointHoverBackgroundColor: "#4F46E5",
        pointHoverBorderColor: "#fff",
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#f8fafc",
        bodyColor: "#e2e8f0",
        borderColor: "#334155",
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context) => {
            const count = context.parsed.y;
            return f(
              { id: count === 1 ? "tooltip_visits" : "tooltip_visits_plural" },
              { count },
            );
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#64748b",
        },
        title: {
          display: true,
          text: f({ id: "hour_label" }),
          color: "#64748b",
        },
      },
      y: {
        beginAtZero: true,
        suggestedMax: maxVisits + (maxVisits > 1 ? 1 : 0),
        ticks: {
          color: "#64748b",
          stepSize: 2,
          precision: 0,
          callback: (value) => (Number.isInteger(value) ? value : null),
        },
        grid: {
          color: "#e2e8f0",
        },
        title: {
          display: true,
          text: f({ id: "visit_label" }),
          color: "#64748b",
        },
      },
    },
  };

  return (
    <div className="chart-card p-4 shadow rounded bg-white dark:bg-gray-800">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
        {f({ id: "hourly_visit_chart" })}
      </h3>
      <div className="h-[300px]">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};
