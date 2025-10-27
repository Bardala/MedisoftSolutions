import { Pie } from "react-chartjs-2";
import { FC } from "react";
import { AddressDistributionStat, baseOptions } from "@/shared";

interface AddressDistributionChartProps {
  statistics: AddressDistributionStat[];
}

const AddressDistributionChart: FC<AddressDistributionChartProps> = ({
  statistics,
}) => {
  const data = {
    labels: statistics.map((s) => s.address),
    datasets: [
      {
        label: "Patients per Address",
        data: statistics.map((s) => s.count),
        backgroundColor: [
          "#f87171",
          "#fbbf24",
          "#34d399",
          "#60a5fa",
          "#a78bfa",
          "#f472b6",
        ],
      },
    ],
  };

  return (
    <div className="chart-card p-4 shadow rounded bg-white dark:bg-gray-800 col-span-1 md:col-span-2">
      <h3 className="text-lg font-semibold mb-2">Patients by Address</h3>
      <Pie data={data} options={baseOptions} />
    </div>
  );
};

export default AddressDistributionChart;
