import React, { useState } from "react";
import DailyFinancialReport from "./DailyFinancialReport";

const DailyDentistReport = () => {
  const [showDetails, setShowDetails] = useState(false);

  const stats = {
    patientsToday: 14,
    mostCommonProcedure: "Teeth Cleaning",
    totalRevenue: 11600,
  };

  const toggleDetails = () => {
    setShowDetails((prev) => !prev);
  };

  return (
    <div className="card-container">
      <h2>Daily Reports</h2>
      <p>
        <strong>Patients Today:</strong> {stats.patientsToday}
      </p>
      <p>
        <strong>Most Common Procedure:</strong> {stats.mostCommonProcedure}
      </p>
      <p>
        <strong>Total Revenue:</strong> ${stats.totalRevenue}
      </p>

      <button onClick={toggleDetails} className="details-button">
        {showDetails ? "Hide Details" : "Click for Details"}
      </button>

      {showDetails && <DailyFinancialReport />}
    </div>
  );
};

export default DailyDentistReport;
