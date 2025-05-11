import { useIntl } from "react-intl";
import { Bar } from "react-chartjs-2";
import { ChartOptions } from "chart.js";

export const MonthlyWeekDayChart = ({ weeklyStats }) => {
  const intl = useIntl();

  const chartData = {
    labels: Object.keys(weeklyStats),
    datasets: [
      {
        label: intl.formatMessage({ id: "visit_density" }), // Y-axis label
        data: Object.values(weeklyStats),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.4,
        fill: true,
        borderWidth: 1,
      },
    ],
  };

  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: intl.formatMessage({ id: "weekday_density_chart_description" }), // Title on top of the chart
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: intl.formatMessage({ id: "x_axis_label" }), // Weekdays
        },
      },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 2 },
        title: {
          display: true,
          text: intl.formatMessage({ id: "y_axis_label" }), // Visit count
        },
      },
    },
  };

  return (
    <div className="chart-card p-4 shadow rounded bg-white dark:bg-gray-800">
      <h3 className="text-lg font-semibold mb-2">
        {intl.formatMessage({ id: "weekday_density_chart_title" })}
      </h3>
      {/* <p className="text-sm text-gray-500 mb-4 dark:text-gray-400">
        {intl.formatMessage({ id: "weekday_density_chart_description" })}
      </p> */}
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};
