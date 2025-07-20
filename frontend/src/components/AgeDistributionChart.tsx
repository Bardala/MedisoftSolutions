// import { Pie } from "react-chartjs-2";
// import { Patient } from "../types";
// import { FC } from "react";
// import { baseOptions } from "../utils/chartUtils";
// import { useIntl } from "react-intl";

// interface AgeDistributionChartProps {
//   patients: Patient[];
// }

// // Updated phases with emoji & color
// const agePhases = [
//   { name: "Child", range: [0, 12], emoji: "👶", color: "#FFD166" },
//   { name: "Teen", range: [13, 19], emoji: "🧒", color: "#06D6A0" },
//   { name: "Adult", range: [20, 39], emoji: "🧑", color: "#118AB2" },
//   { name: "Middle", range: [40, 59], emoji: "🧔", color: "#073B4C" },
//   { name: "Senior", range: [60, 100], emoji: "🧓", color: "#EF476F" },
// ];

// export const AgeDistributionChart: FC<AgeDistributionChartProps> = ({
//   patients,
// }) => {
//   const { formatMessage: f } = useIntl();
//   // Count patients per phase
//   const phaseCounts = agePhases.map((phase) => {
//     const count = patients.filter(
//       (p) =>
//         p.age != null && p.age >= phase.range[0] && p.age <= phase.range[1],
//     ).length;
//     return count;
//   });

//   const data = {
//     labels: agePhases.map(
//       (p) =>
//         `${p.emoji} ${f({
//           id: `age_phase_${p.name.toLowerCase()}`,
//         })}`,
//     ),

//     datasets: [
//       {
//         label: f({ id: "patients_by_age_phase" }),
//         data: phaseCounts,
//         backgroundColor: agePhases.map((p) => p.color),
//       },
//     ],
//   };

//   return (
//     <div className="chart-card p-4 shadow rounded bg-white dark:bg-gray-800">
//       <h3 className="text-lg font-semibold mb-2">
//         {f({ id: "age_distribution" })}
//       </h3>
//       <Pie data={data} options={baseOptions} />
//     </div>
//   );
// };
// src/components/AgeDistributionChart.tsx
import { Pie } from "react-chartjs-2";
import { FC } from "react";
import { baseOptions } from "../utils/chartUtils";
import { useIntl } from "react-intl";
import { AgeDistributionStat } from "../types";

interface AgeDistributionChartProps {
  statistics: AgeDistributionStat[];
}

export const AgeDistributionChart: FC<AgeDistributionChartProps> = ({
  statistics,
}) => {
  const { formatMessage: f } = useIntl();

  const data = {
    labels: statistics.map(
      (s) => `${s.emoji} ${f({ id: `age_phase_${s.phase.toLowerCase()}` })}`,
    ),
    datasets: [
      {
        label: f({ id: "patients_by_age_phase" }),
        data: statistics.map((s) => s.count),
        backgroundColor: statistics.map((s) => s.color),
      },
    ],
  };

  return (
    <div className="chart-card p-4 shadow rounded bg-white dark:bg-gray-800">
      <h3 className="text-lg font-semibold mb-2">
        {f({ id: "age_distribution" })}
      </h3>
      <Pie data={data} options={baseOptions} />
    </div>
  );
};
