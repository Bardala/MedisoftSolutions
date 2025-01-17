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
  ChartOptions,
} from "chart.js";
import "../styles/monthlyDoctorReports.css";
import { useMonthlyReport } from "../hooks/useMonthlyReport";

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

  const { summary, daysInfo, isError, isLoading, summaryError, daysInfoError } =
    useMonthlyReport();

  // Initialize weekly stats
  const weeklyStats = {
    Sunday: 0,
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
  };

  // Populate weekly stats with data from daysInfo
  if (daysInfo) {
    daysInfo.forEach((dayInfo) => {
      const date = new Date(dayInfo.date);
      const dayName = date.toLocaleString("en-US", { weekday: "long" });
      weeklyStats[dayName] += dayInfo.totalVisits;
    });
  }

  // Determine the most and least crowded weekdays (excluding Friday)
  const weekdays = { ...weeklyStats };
  delete weekdays.Friday; // Exclude Friday (weekend)

  const mostCrowdedWeekday = Object.keys(weekdays).reduce((a, b) =>
    weekdays[a] > weekdays[b] ? a : b,
  );

  const leastCrowdedWeekday = Object.keys(weekdays).reduce((a, b) =>
    weekdays[a] < weekdays[b] ? a : b,
  );

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
    scales: { y: { beginAtZero: true } },
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError)
    return (
      <div>
        Error:
        {summaryError && <p>{summaryError.message}</p>}
        {daysInfoError && <p>{daysInfoError.message}</p>}
      </div>
    );

  return (
    <div className="reports-container">
      <h2>Monthly Financial Report</h2>

      {/* Monthly Summary Card */}
      <div className="summary-card">
        <h3>Monthly Summary</h3>
        <p>
          <strong>Total Visits:</strong> {summary?.totalVisits || "-"}
        </p>
        <p>
          <strong>Most Common Procedure:</strong>{" "}
          {summary?.mostCommonProcedure || "-"}
        </p>
        <p>
          <strong>Total Revenue:</strong> ${summary?.totalRevenue || "-"}
        </p>
        <p>
          <strong>Most Crowded Weekday:</strong> {mostCrowdedWeekday || "-"}
        </p>
        <p>
          <strong>Least Crowded Weekday:</strong> {leastCrowdedWeekday || "-"}
        </p>
        <p>
          <strong>New Patients This Month:</strong>{" "}
          {summary?.totalNewPatients || "-"}
        </p>
      </div>

      {/* Calendar View */}
      <div className="calendar">
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const date = new Date(currentYear, currentMonth, day);
          const dayName = date.toLocaleString("en-US", { weekday: "short" });
          const dayInfo = daysInfo?.find(
            (info) => new Date(info.date).getDate() === day,
          );

          return (
            <div key={day} className="calendar-day">
              <div className="date">
                {dayName} {day}
              </div>
              <div className="day-data">
                <p>{dayInfo?.totalVisits || "-"}</p>
                <p className="small-text">{dayInfo?.mostProcedure || "-"}</p>
                <p>${dayInfo?.totalRevenue || "-"}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Weekly Statistics Card */}
      <div className="chart-card">
        <h3>Weekly Visits Statistics</h3>
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Advice Section */}
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
          <strong>Popular Procedure:</strong>{" "}
          {summary?.mostCommonProcedure || "None"}. Consider offering promotions
          or packages around this procedure.
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
