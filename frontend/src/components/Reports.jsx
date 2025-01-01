import React from "react";

const Reports = () => {
  const stats = {
    patientsToday: 15,
    mostCommonProcedure: "Teeth Cleaning",
    totalRevenue: 2500,
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
    </div>
  );
};

export default Reports;
