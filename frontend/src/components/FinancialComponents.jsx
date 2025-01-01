import React from "react";
import "../styles/financialComponents.css";
import { payments } from "../paymentsDb";

const FinancialReports = () => {
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
      <h2>Financial Reports</h2>
      <div className="stats">
        <p>Total Daily Revenue: ${stats.dailyRevenue}</p>
        <p>Total Patients: {stats.totalPatients}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>Amount Paid</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment, index) => (
            <tr key={index}>
              <td>{payment.name}</td>
              <td>${payment.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FinancialReports;
