import { Line } from "react-chartjs-2";
import { Patient } from "../types";
import { FC } from "react";
import { baseOptions } from "../utils/chartUtils";
import { ChartOptions } from "chart.js";

interface PatientRegistrationTrendChartProps {
  patients: Patient[];
}

export const PatientRegistrationTrendChart: FC<
  PatientRegistrationTrendChartProps
> = ({ patients }) => {
  const currentYear = new Date().getFullYear();

  // Filter only patients from the current year
  const currentYearPatients = patients.filter(
    (p) => p.createdAt && new Date(p.createdAt).getFullYear() === currentYear,
  );

  const monthCounts: Record<string, number> = {};

  currentYearPatients.forEach((p) => {
    const date = new Date(p.createdAt);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0",
    )}`;
    monthCounts[month] = (monthCounts[month] || 0) + 1;
  });

  const sortedMonths = Object.keys(monthCounts).sort();

  const data = {
    labels: sortedMonths,
    datasets: [
      {
        label: "New Patients",
        data: sortedMonths.map((month) => monthCounts[month]),
        fill: false,
        borderColor: "#10b981",
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const optimizedOptions: ChartOptions<"line"> = {
    ...baseOptions,
    animation: false,
    elements: {
      point: {
        radius: 0,
      },
    },
  };

  return (
    <div className="chart-card p-4 shadow rounded bg-white dark:bg-gray-800 col-span-1 md:col-span-2">
      <h3 className="text-lg font-semibold mb-2">
        Patient Registrations This Year
      </h3>
      <Line data={data} options={optimizedOptions} />
    </div>
  );
};
