import { Bar, Pie } from "react-chartjs-2";
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

import { useIntl } from "react-intl";
import { Payment, Visit, VisitDentalProcedure } from "../types";
import { monthAndYearTimeFormat } from "../utils";

import { Line } from "react-chartjs-2";
import { LineElement, PointElement } from "chart.js";

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

interface Props {
  payments: Payment[];
  visits: Visit[];
  visitDentalProcedures: VisitDentalProcedure[];
}

export const PatientCharts: React.FC<Props> = ({
  payments,
  visits,
  visitDentalProcedures,
}) => {
  const { formatMessage } = useIntl();

  // --- Payments Grouped by Month ---
  const paymentsByMonth = payments.reduce((acc, p) => {
    // const month = format(new Date(p.createdAt!), "yyyy-MM");
    const month = monthAndYearTimeFormat(p.createdAt);
    acc[month] = (acc[month] || 0) + p.amount;
    return acc;
  }, {} as Record<string, number>);

  const paymentChartData = {
    labels: Object.keys(paymentsByMonth),
    datasets: [
      {
        label: formatMessage({ id: "monthly_payments" }),
        data: Object.values(paymentsByMonth),
        backgroundColor: "rgba(153, 102, 255, 0.5)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  // --- Procedure Frequency ---
  const procedureCounts = visitDentalProcedures.reduce((acc, vdp) => {
    const name = vdp.procedureName;
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const proceduresChartData = {
    labels: Object.keys(procedureCounts),
    datasets: [
      {
        label: formatMessage({ id: "procedure_frequency" }),
        data: Object.values(procedureCounts),
        backgroundColor: [
          "#4BC0C0",
          "#36A2EB",
          "#FF6384",
          "#FF9F40",
          "#9966FF",
          "#FFCD56",
        ],
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      <h3 className="text-2xl font-bold mb-4">
        {formatMessage({ id: "patient_charts_title" })}{" "}
      </h3>

      <>
        <PatientVisitsByHourChart visits={visits} />

        {/* Visits */}
        {/* <div className="chart-card p-4 shadow rounded bg-white dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-2">
            {formatMessage({ id: "monthly_visits" })}
          </h3>
          <Bar data={visitsChartData} options={baseOptions} />
        </div> */}

        {/* Payments */}
        <div className="chart-card p-4 shadow rounded bg-white dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-2">
            {formatMessage({ id: "monthly_payments" })}
          </h3>
          <Bar data={paymentChartData} options={baseOptions} />
        </div>

        {/* Procedure Types */}
        <div className="chart-card p-4 shadow rounded bg-white dark:bg-gray-800 col-span-1 md:col-span-2">
          <h3 className="text-lg font-semibold mb-2">
            {formatMessage({ id: "procedure_frequency" })}
          </h3>
          <Pie data={proceduresChartData} options={baseOptions} />
        </div>
      </>
    </div>
  );
};

export const PatientVisitsByHourChart = ({ visits }) => {
  const { formatMessage } = useIntl();

  // Fix: use numeric hours instead of string
  const visitsByHour = visits.reduce((acc, v) => {
    const hour = new Date(v.createdAt).getHours(); // returns 0–23
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const fullHourRange = Array.from({ length: 24 }, (_, i) => i);
  const visitsByHourData = fullHourRange.map((hour) => visitsByHour[hour] || 0);
  const maxVisits = Math.max(...visitsByHourData, 1);

  const visitsByHourChartData = {
    labels: fullHourRange.map((h) =>
      new Date(0, 0, 0, h).toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    ),
    datasets: [
      {
        label: formatMessage({ id: "visits_by_hour" }),
        data: visitsByHourData,
        fill: false,
        tension: 0.3,
        borderColor: "rgba(255, 159, 64, 1)",
        backgroundColor: "rgba(255, 159, 64, 0.5)",
        pointRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#f8fafc",
        bodyColor: "#e2e8f0",
        borderColor: "#334155",
        borderWidth: 1,
        padding: 12,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#64748b" },
      },
      y: {
        beginAtZero: true,
        suggestedMax: maxVisits + (maxVisits > 1 ? 1 : 0),
        ticks: {
          color: "#64748b",
          stepSize: 1,
          precision: 0,
          callback: (value) => (Number.isInteger(value) ? value : null),
        },
        grid: { color: "#e2e8f0" },
      },
    },
  };

  return (
    <div className="chart-card p-4 shadow rounded bg-white dark:bg-gray-800 col-span-1 md:col-span-2">
      <h3 className="text-lg font-semibold mb-2">
        {formatMessage({ id: "visits_by_hour" })}
      </h3>
      <div className="h-[300px]">
        <Line data={visitsByHourChartData} options={chartOptions} />
      </div>
    </div>
  );
};
