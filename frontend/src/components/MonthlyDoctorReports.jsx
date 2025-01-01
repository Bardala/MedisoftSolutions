import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { dailyReports } from "../db/reportsDb";
import "../styles/monthlyDoctorReports.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const MonthlyDentistReport = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const monthlyStats = {
    totalPatients: 0,
    totalRevenue: 0,
    procedures: {},
  };

  const weeklyStats = {
    Sunday: 0,
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
  };

  Array.from({ length: daysInMonth }, (_, i) => i + 1).forEach((day) => {
    const report = dailyReports[day];
    if (report) {
      monthlyStats.totalPatients += report.patientsToday;
      monthlyStats.totalRevenue += report.totalRevenue;

      // Track procedure count
      monthlyStats.procedures[report.mostCommonProcedure] =
        (monthlyStats.procedures[report.mostCommonProcedure] || 0) + 1;

      // Add to weekly stats
      const date = new Date(currentYear, currentMonth, day);
      const dayName = date.toLocaleString("en-US", { weekday: "long" });
      weeklyStats[dayName] += report.patientsToday;
    }
  });

  const mostCommonProcedure = Object.keys(monthlyStats.procedures).reduce(
    (a, b) => (monthlyStats.procedures[a] > monthlyStats.procedures[b] ? a : b),
    "",
  );

  const mostCrowdedWeekday = Object.keys(weeklyStats).reduce((a, b) =>
    weeklyStats[a] > weeklyStats[b] ? a : b,
  );

  const leastCrowdedWeekday = Object.keys(weeklyStats).reduce((a, b) =>
    weeklyStats[a] < weeklyStats[b] ? a : b,
  );

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

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Weekly Visits Statistics" },
    },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div className="reports-container">
      <h2>Monthly Financial Report</h2>

      {/* Monthly Summary Card */}
      <div className="summary-card">
        <h3>Monthly Summary</h3>
        <p>
          <strong>Total Patients:</strong> {monthlyStats.totalPatients}
        </p>
        <p>
          <strong>Most Common Procedure:</strong> {mostCommonProcedure || "-"}
        </p>
        <p>
          <strong>Total Revenue:</strong> ${monthlyStats.totalRevenue}
        </p>
        <p>
          <strong>Most Crowded Weekday:</strong> {mostCrowdedWeekday || "-"}
        </p>
      </div>

      {/* Weekly Statistics Card */}
      <div className="chart-card">
        <h3>Weekly Visits Statistics</h3>
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Advice Card */}
      <div className="advice-card">
        <h3>Advice for Better Management</h3>
        <p>
          <strong>Focus on:</strong> {mostCrowdedWeekday} for better scheduling
          and resource allocation.
        </p>
        <p>
          <strong>Promote appointments on:</strong> {leastCrowdedWeekday} to
          balance the load.
        </p>
        <p>
          <strong>Popular Procedure:</strong> {mostCommonProcedure || "None"}.
          Consider offering promotions or packages around this procedure.
        </p>
        <p>
          <strong>Staffing Advice:</strong> Ensure adequate staff on{" "}
          {mostCrowdedWeekday}.
        </p>
      </div>
    </div>
  );
};

export default MonthlyDentistReport;
