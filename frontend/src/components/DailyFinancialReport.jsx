import React from "react";
import "../styles/financialComponents.css";
import { payments } from "../paymentsDb";

const DailyFinancialReport = () => {
  const dailyRevenue = payments.reduce(
    (total, payment) => total + payment.amount,
    0,
  );
  const totalPatients = payments.length;

  const stats = {
    dailyRevenue: dailyRevenue,
    totalPatients: totalPatients,
  };

  return (
    <div className="card-container">
      <h2>Daily Financial Report</h2>
      <div className="stats">
        <p>Total Daily Revenue: ${stats.dailyRevenue}</p>
        <p>Total Patients: {stats.totalPatients}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>Amount Paid</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment, index) => (
            <tr key={index}>
              <td>{payment.name}</td>
              <td>${payment.amount}</td>
              <td>{payment.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DailyFinancialReport;
