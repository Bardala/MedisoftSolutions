import { Pie } from "react-chartjs-2";
import { Patient } from "../types";
import { FC } from "react";
import { baseOptions } from "../utils/chartUtils";

interface AddressDistributionChartProps {
  patients: Patient[];
}

export const AddressDistributionChart: FC<AddressDistributionChartProps> = ({
  patients,
}) => {
  const addressCounts: Record<string, number> = {};

  patients.forEach((p) => {
    const address = p.address || "Unknown";
    addressCounts[address] = (addressCounts[address] || 0) + 1;
  });

  const data = {
    labels: Object.keys(addressCounts),
    datasets: [
      {
        label: "Patients per Address",
        data: Object.values(addressCounts),
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
