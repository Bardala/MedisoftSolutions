import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faDollarSign,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/home.css";
import { useMonthlyReport } from "../hooks/useMonthlyReport";
import { useDailyReportData } from "../hooks/useDailyReportData";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid"; // For unique notification IDs
import { dailyTimeFormate } from "../utils";

const Home = ({
  setSelectedOption,
}: {
  setSelectedOption: (option: string) => void;
}) => {
  const { summary } = useMonthlyReport();
  const { patients, visits, payments, isLoading, isError } =
    useDailyReportData();

  const [notifications, setNotifications] = useState<
    { id: string; message: string; time: string }[]
  >([]);

  // Effect to generate notifications based on daily report data
  useEffect(() => {
    if (!isLoading && !isError) {
      // Combine all entities into a single array with a unified structure
      const combinedData = [
        ...patients.map((patient) => ({
          id: uuidv4(),
          message: `New patient registration: ${patient.fullName}, from: ${patient.address} `,
          time: new Date(patient.createdAt).toLocaleString(),
          createdAt: patient.createdAt,
        })),
        ...visits.map((visit) => ({
          id: uuidv4(),
          message: `New visit recorded for patient: ${visit.patient.fullName}`,
          time: new Date(visit.createdAt).toLocaleString(),
          createdAt: visit.createdAt,
        })),
        ...payments.map((payment) => ({
          id: uuidv4(),
          message: `Payment received: $${payment.amount} from ${payment.patient.fullName}`,
          time: new Date(payment.createdAt).toLocaleString(),
          createdAt: payment.createdAt,
        })),
      ];

      // Sort the combined data by the createdAt timestamp in descending order
      const sortedNotifications = combinedData.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      setNotifications(sortedNotifications);
    }
  }, [patients, visits, payments, isLoading, isError]);

  return (
    <div className="home">
      <h1>Welcome to the Dashboard</h1>
      <p>Select an option from the menu to get started.</p>

      {/* Dashboard Summary */}
      <section className="dashboard-summary">
        <div className="summary-item">
          <h3>{summary?.totalNewPatients || 0}</h3>
          <p>Total New Patients</p>
        </div>
        <div className="summary-item">
          <h3>{summary?.totalVisits || 0}</h3>
          <p>Total Visits</p>
        </div>
        <div className="summary-item">
          <h3>${summary?.totalRevenue || 0}</h3>
          <p>Total Payments</p>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions">
          <button
            className="action-btn"
            onClick={() => setSelectedOption("/add-patient")}
          >
            <FontAwesomeIcon icon={faUserPlus} />
            Add New Patient
          </button>
          <button
            className="action-btn"
            onClick={() => setSelectedOption("/payments")}
          >
            <FontAwesomeIcon icon={faDollarSign} />
            Add Payment
          </button>
          <button
            className="action-btn"
            onClick={() => setSelectedOption("/record-new-visit")}
          >
            <FontAwesomeIcon icon={faPlusCircle} />
            {/* View Appointments */}
            Record New Visit
          </button>
        </div>
      </section>

      {/* Notifications */}
      <section className="notifications">
        <h3>Recent Notifications</h3>
        {isLoading ? (
          <p>Loading notifications...</p>
        ) : isError ? (
          <p>Error loading notifications</p>
        ) : (
          <ul>
            {notifications.map((notification) => (
              <li key={notification.id}>
                <p>{notification.message}</p>
                <span>{dailyTimeFormate(notification.time)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Home;
