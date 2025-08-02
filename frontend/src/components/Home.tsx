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
import { isEqual } from "lodash"; // For deep comparison
import { useIntl } from "react-intl";
import { Notifications } from "./Notifications";
import { NotificationType } from "../types";
import { useNavigate } from "react-router-dom";
import { buildRoute } from "../utils/routeUtils";

const Home = () => {
  const { formatMessage: f } = useIntl();
  const { patients, visits, payments, totalPayments, isLoading, isError } =
    useDailyReportData();

  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  // Use refs to store previous values of patients, visits, and payments
  const prevPatientsRef = useRef<typeof patients>([]);
  const prevVisitsRef = useRef<typeof visits>([]);
  const prevPaymentsRef = useRef<typeof payments>([]);
  const navigate = useNavigate();
  // If current time is between 12am and 6am, use yesterday's date; otherwise, use today
  const now = new Date();
  const isEarlyMorning = now.getHours() >= 0 && now.getHours() < 6;
  const dateObj = isEarlyMorning
    ? new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
    : now;
  const today = dateObj.toISOString().split("T")[0];

  // Memoize the combined data and sorted notifications
  const combinedData = useMemo(() => {
    if (!isLoading && !isError) {
      return [
        ...patients.map(
          (patient): NotificationType => ({
            id: uuidv4() as string,
            message: f(
              { id: "new_patient_registered" },
              {
                name: patient.fullName,
                address: patient.address || f({ id: "not_available" }),
              },
            ),
            createdAt: patient.createdAt,
            type: "Patient",
          }),
        ),
        ...visits.map(
          (visit): NotificationType => ({
            id: uuidv4() as string,
            message: f(
              { id: "new_visit_recorded" },
              { name: visit.patientName },
            ),
            createdAt: visit.createdAt,
            type: "Visit",
          }),
        ),
        ...payments.map(
          (payment): NotificationType => ({
            id: uuidv4() as string,
            message: f(
              { id: "payment_received" },
              { amount: payment.amount, name: payment.patientName },
            ),
            createdAt: payment.createdAt,
            type: "Payment",
          }),
        ),
      ];
    }
    return [];
  }, [patients, visits, payments, isLoading, isError, f]);

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

  const NotificationsComponent = () =>
    notifications && (
      <Notifications
        notifications={notifications}
        isError={isError}
        isLoading={isLoading}
      />
    );

  return (
    <div className="home">
      <h1>{f({ id: "welcome_dashboard" })}</h1>
      <p>{f({ id: "select_option" })}</p>

      {/* Dashboard Summary */}
      <section className="dashboard-summary">
        <div
          className="summary-item clickable-cell"
          onClick={() => navigate(buildRoute("REPORTS", { date: today }))}
        >
          <h3>🆕🤧{patients?.length || 0}</h3>
          <p>{f({ id: "daily_patients" })}</p>
        </div>
        <div
          className="summary-item clickable-cell"
          onClick={() => navigate(buildRoute("REPORTS", { date: today }))}
        >
          <h3>🏥{visits?.length || 0}</h3>
          <p>{f({ id: "total_visits" })}</p>
        </div>
        <div
          className="summary-item clickable-cell"
          onClick={() => navigate(buildRoute("REPORTS", { date: today }))}
        >
          <h3>💰{totalPayments || 0}</h3>
          <p>{f({ id: "total_payments" })}</p>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <h3>{f({ id: "quick_actions" })}</h3>
        <div className="actions">
          <button
            className="action-btn"
            onClick={() => navigate("/add-patient")}
          >
            <FontAwesomeIcon icon={faUserPlus} />
            {f({ id: "add_patient" })}
          </button>
          <button className="action-btn" onClick={() => navigate("/payments")}>
            <FontAwesomeIcon icon={faDollarSign} />
            {f({ id: "home.add_payment" })}
          </button>
          <button
            className="action-btn"
            onClick={() => navigate("/record-new-visit")}
          >
            <FontAwesomeIcon icon={faPlusCircle} />
            {f({ id: "record_visit" })}
          </button>
        </div>
      </section>

      {/* Notifications */}
      {NotificationsComponent()}
    </div>
  );
};

export default Home;
