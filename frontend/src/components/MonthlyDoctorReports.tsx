import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "../styles/monthlyDoctorReports.css";
import { useMonthlyReport } from "../hooks/useMonthlyReport";
import { ChartComponent } from "./ChartComponent";
import { useIntl } from "react-intl";
import { MonthlyCharts } from "./MonthlyCharts";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { ToggleStatsData } from "./ToggleStatsData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const MonthlyDentistReport = () => {
  const { formatMessage: f } = useIntl();
  // todo: start year should be 2025 in production, but keep it 2020 for preview.
  const startYear = 2025;
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [showStats, setShowStats] = useState(false);

  const { summary, daysInfo, isError, isLoading, summaryError, daysInfoError } =
    useMonthlyReport(selectedYear, selectedMonth);

  const handleYearChange = (operation: 1 | -1) => {
    setSelectedYear(selectedYear + operation);
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(parseInt(event.target.value));
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const currentDate = new Date(selectedYear, selectedMonth - 1, 1);
  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();

  // Initialize weekly stats
  const weeklyStats = {
    Saturday: 0,
    Sunday: 0,
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
  };

  // Populate weekly stats with data from daysInfo
  if (daysInfo?.length > 0) {
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

  if (isLoading) return <div>{f({ id: "loading" })}</div>;
  if (isError)
    return (
      <div>
        {f({ id: "error" })}:{summaryError && <p>{summaryError.message}</p>}
        {daysInfoError && <p>{daysInfoError.message}</p>}
      </div>
    );

  return (
    <div className="reports-container">
      <ToggleStatsData
        header={f({ id: "monthlyReports" })}
        setShowStats={setShowStats}
        showStats={showStats}
        dataIcon={faCalendarAlt}
      />

      {/* Month and Year Selector */}
      <div className="month-year-selector">
        <label className="report-year">
          <span>
            <strong>{selectedYear}</strong>
          </span>
          <div className="report-year-buttons-container">
            <button
              className="report-year-button"
              disabled={selectedYear >= currentYear}
              onClick={() => handleYearChange(1)}
              title={f({ id: "up" })}
            >
              ▲
            </button>
            <button
              className="report-year-button"
              disabled={selectedYear === startYear}
              onClick={() => handleYearChange(-1)}
              title={f({ id: "down" })}
            >
              ▼
            </button>
          </div>
        </label>
        <label>
          {f({ id: "month" })}:
          <select value={selectedMonth} onChange={handleMonthChange}>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(selectedYear, i, 1).toLocaleString("default", {
                  month: "long",
                })}
              </option>
            ))}
          </select>
        </label>
      </div>

      {showStats ? (
        <>
          {/*Statistics Card */}
          <ChartComponent weeklyStats={weeklyStats} />

          <MonthlyCharts
            year={selectedYear}
            month={selectedMonth}
            daysInfo={daysInfo}
            summary={summary}
          />
        </>
      ) : (
        <>
          {/* Monthly Summary Card */}
          <div className="summary-card">
            <h3>{f({ id: "monthly_summary" })}</h3>
            <p>
              {f({ id: "total_visits" })}:{" "}
              <strong>{summary?.totalVisits || "-"}</strong>
            </p>
            <p>
              {f({ id: "most_common_procedure" })}:{" "}
              <strong>{summary?.mostCommonProcedure || "-"}</strong>
            </p>
            <p>
              {f({ id: "total_revenue" })}:{" "}
              <strong>${summary?.totalRevenue || "-"}</strong>
            </p>
            <p>
              {f({ id: "most_crowded_weekday" })}:{" "}
              <strong>{mostCrowdedWeekday || "-"}</strong>
            </p>
            <p>
              {f({ id: "least_crowded_weekday" })}:{" "}
              <strong>{leastCrowdedWeekday || "-"}</strong>
            </p>
            <p>
              {f({ id: "new_patients" })}:{" "}
              <strong>{summary?.totalNewPatients || "-"}</strong>
            </p>
          </div>

          {/* Calendar View */}
          <div className="calendar">
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const date = new Date(selectedYear, selectedMonth - 1, day);
              const dayName = date.toLocaleString("en-US", {
                weekday: "short",
              });
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
                    <p className="small-text">
                      {dayInfo?.mostProcedure || "-"}
                    </p>
                    <p>${dayInfo?.totalRevenue || "-"}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Advice Section */}
          <div className="advice-card">
            <h3>{f({ id: "advice_management" })}</h3>
            <p>
              <strong>{f({ id: "focus_on" })}:</strong> {mostCrowdedWeekday}{" "}
              {f({ id: "better_scheduling" })}
            </p>
            <p>
              <strong>{f({ id: "promote_appointments" })}:</strong>{" "}
              {leastCrowdedWeekday} {f({ id: "balance_load" })}
            </p>
            <p>
              <strong>{f({ id: "popular_procedure" })}:</strong>{" "}
              {summary?.mostCommonProcedure || "None"}.{" "}
              {f({ id: "consider_promotions" })}
            </p>
            <p>
              <strong>{f({ id: "staffing_advice" })}:</strong>{" "}
              {f({ id: "ensure_staff" })} {mostCrowdedWeekday}.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default MonthlyDentistReport;
