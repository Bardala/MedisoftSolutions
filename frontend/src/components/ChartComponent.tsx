import React from "react";
import { useIntl } from "react-intl";
import { Bar } from "react-chartjs-2";
import { ChartOptions } from "chart.js";

export const ChartComponent = ({ weeklyStats }) => {
  const intl = useIntl();

  const chartData = {
    labels: Object.keys(weeklyStats),
    datasets: [
      {
        label: intl.formatMessage({ id: "chartLabel" }),
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
      title: { display: true, text: intl.formatMessage({ id: "chartTitle" }) },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 2 },
      },
    },
  };

  return (
    <div className="chart-card">
      <h3>{intl.formatMessage({ id: "chartTitle" })}</h3>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};
