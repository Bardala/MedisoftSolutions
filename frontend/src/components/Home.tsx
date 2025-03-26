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
import { useIntl } from "react-intl";

const Home = ({
  setSelectedOption,
}: {
  setSelectedOption: (option: string) => void;
}) => {
  const { formatMessage: f } = useIntl();
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
          message: f(
            { id: "new_patient_registered" },
            {
              name: patient.fullName,
              address: patient.address || f({ id: "not_available" }),
            },
          ),
          time: new Date(patient.createdAt).toLocaleString(),
          createdAt: patient.createdAt,
        })),
        ...visits.map((visit) => ({
          id: uuidv4(),
          message: f(
            { id: "new_visit_recorded" },
            { name: visit.patient.fullName },
          ),
          time: new Date(visit.createdAt).toLocaleString(),
          createdAt: visit.createdAt,
        })),
        ...payments.map((payment) => ({
          id: uuidv4(),
          message: f(
            { id: "payment_received" },
            { amount: payment.amount, name: payment.patient.fullName },
          ),
          time: new Date(payment.createdAt).toLocaleString(),
          createdAt: payment.createdAt,
        })),
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

  return (
    <div className="home">
      <h1>{f({ id: "welcome_dashboard" })}</h1>
      <p>{f({ id: "select_option" })}</p>

      {/* Dashboard Summary */}
      <section className="dashboard-summary">
        <div className="summary-item">
          <h3>🆕🤒{patients?.length || 0}</h3>
          <p>{f({ id: "daily_patients" })}</p>
        </div>
        <div className="summary-item">
          <h3>🏥{visits?.length || 0}</h3>
          <p>{f({ id: "total_visits" })}</p>
        </div>
        <div className="summary-item">
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
            onClick={() => setSelectedOption("/add-patient")}
          >
            <FontAwesomeIcon icon={faUserPlus} />
            {f({ id: "add_patient" })}
          </button>
          <button
            className="action-btn"
            onClick={() => setSelectedOption("/payments")}
          >
            <FontAwesomeIcon icon={faDollarSign} />
            {f({ id: "home.add_payment" })}
          </button>
          <button
            className="action-btn"
            onClick={() => setSelectedOption("/record-new-visit")}
          >
            <FontAwesomeIcon icon={faPlusCircle} />
            {f({ id: "record_visit" })}
          </button>
        </div>
      </section>

      {/* Notifications */}
      <section className="notifications">
        <h3>{f({ id: "recent_notifications" })}</h3>
        {isLoading ? (
          <p>{f({ id: "loading_notifications" })}</p>
        ) : isError ? (
          <p>{f({ id: "error_notifications" })}</p>
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
          <p>{f({ id: "no_operations" })}</p>
        )}
      </section>
    </div>
  );
};

export default Home;
