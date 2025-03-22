import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faDollarSign,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/home.css";
import { useDailyReportData } from "../hooks/useDailyReportData";
import { useState, useEffect, useMemo, useRef } from "react";
import { v4 as uuidv4 } from "uuid"; // For unique notification IDs
import { dailyTimeFormate } from "../utils";
import { isEqual } from "lodash"; // For deep comparison

const Home = ({
  setSelectedOption,
}: {
  setSelectedOption: (option: string) => void;
}) => {
  // const { summary } = useMonthlyReport();
  const { patients, visits, payments, totalPayments, isLoading, isError } =
    useDailyReportData();

  const [notifications, setNotifications] = useState<
    { id: string; message: string; time: string }[]
  >([]);

  // Use refs to store previous values of patients, visits, and payments
  const prevPatientsRef = useRef<typeof patients>([]);
  const prevVisitsRef = useRef<typeof visits>([]);
  const prevPaymentsRef = useRef<typeof payments>([]);

  // Memoize the combined data and sorted notifications
  const combinedData = useMemo(() => {
    if (!isLoading && !isError) {
      return [
        ...patients.map((patient) => ({
          id: uuidv4(),
          message: `🆕🤒 New patient registration: ${patient.fullName}, from: ${patient.address} `,
          time: new Date(patient.createdAt).toLocaleString(),
          createdAt: patient.createdAt,
        })),
        ...visits.map((visit) => ({
          id: uuidv4(),
          message: `🏥 New visit recorded for patient: ${visit.patient.fullName}`,
          time: new Date(visit.createdAt).toLocaleString(),
          createdAt: visit.createdAt,
        })),
        ...payments.map((payment) => ({
          id: uuidv4(),
          message: `💰 Payment received: $${payment.amount} from ${payment.patient.fullName}`,
          time: new Date(payment.createdAt).toLocaleString(),
          createdAt: payment.createdAt,
        })),
      ];
    }
    return [];
  }, [patients, visits, payments, isLoading, isError]);

  const sortedNotifications = useMemo(() => {
    return combinedData.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [combinedData]);

  // Update notifications only if sortedNotifications has changed
  useEffect(() => {
    // Check if the data has actually changed using deep comparison
    const patientsChanged = !isEqual(patients, prevPatientsRef.current);
    const visitsChanged = !isEqual(visits, prevVisitsRef.current);
    const paymentsChanged = !isEqual(payments, prevPaymentsRef.current);

    if (patientsChanged || visitsChanged || paymentsChanged) {
      setNotifications(sortedNotifications);
    }

    // Update the refs with the current values
    prevPatientsRef.current = patients;
    prevVisitsRef.current = visits;
    prevPaymentsRef.current = payments;
  }, [sortedNotifications, patients, visits, payments]);

  return (
    <div className="home">
      <h1>Welcome to the Dashboard</h1>
      <p>Select an option from the menu to get started.</p>

      {/* Dashboard Summary */}
      <section className="dashboard-summary">
        <div className="summary-item">
          <h3>🆕🤒{patients?.length || 0}</h3>
          <p>New Patients</p>
        </div>
        <div className="summary-item">
          <h3>🏥{visits?.length || 0}</h3>
          <p>Total Visits</p>
        </div>
        <div className="summary-item">
          <h3>💰{totalPayments || 0}</h3>
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
        ) : notifications.length > 0 ? (
          <ul>
            {notifications.map((notification) => (
              <li key={notification.id}>
                <p>{notification.message}</p>
                <span>{dailyTimeFormate(notification.time)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>There have been no operations performed today.</p>
        )}
      </section>
    </div>
  );
};

export default Home;
