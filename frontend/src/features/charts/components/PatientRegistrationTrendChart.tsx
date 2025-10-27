import { Line } from "react-chartjs-2";
import { FC } from "react";
import { ChartOptions } from "chart.js";
import { RegistrationTrendStat, baseOptions } from "@/shared";

interface PatientRegistrationTrendChartProps {
  statistics: RegistrationTrendStat[];
}

const PatientRegistrationTrendChart: FC<PatientRegistrationTrendChartProps> = ({
  statistics,
}) => {
  const sortedStatistics = [...statistics].sort((a, b) => {
    return new Date(a.month).getTime() - new Date(b.month).getTime();
  });

  const data = {
    labels: sortedStatistics.map((s) => {
      const date = new Date(s.month);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0",
      )}`;
    }),
    datasets: [
      {
        label: "New Patients",
        data: sortedStatistics.map((s) => s.count),
        fill: false,
        borderColor: "#10b981",
        backgroundColor: "#10b981",
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 2,
      },
    ],
  };

  const optimizedOptions: ChartOptions<"line"> = {
    ...baseOptions,
    animation: {
      duration: 1000,
    },
    elements: {
      point: {
        radius: 3,
        hoverRadius: 5,
      },
      line: {
        tension: 0.4,
      },
    },
  };

  return (
    <div className="chart-card p-4 shadow rounded bg-white dark:bg-gray-800 col-span-1 md:col-span-2">
      <h3 className="text-lg font-semibold mb-2">
        Patient Registrations This Year
      </h3>
      <div className="h-64 w-full">
        <Line data={data} options={optimizedOptions} />
      </div>
    </div>
  );
};

export default PatientRegistrationTrendChart;
