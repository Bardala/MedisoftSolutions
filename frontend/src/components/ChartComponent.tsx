import { Bar } from "react-chartjs-2";
import { ChartOptions } from "chart.js";

export const ChartComponent = ({ weeklyStats }) => {
  // Chart data
  const chartData = {
    labels: Object.keys(weeklyStats),
    datasets: [
      {
        label: "Number of Visits",
        data: Object.values(weeklyStats),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Weekly Visits Statistics" },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 2,
        },
      },
    },
  };

  return (
    <div className="chart-card">
      <h3>Weekly Visits Statistics</h3>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};
