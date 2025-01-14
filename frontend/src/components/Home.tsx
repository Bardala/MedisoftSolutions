import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faChartBar,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/home.css"; // Assuming you will style this

const Home = ({
  setSelectedOption,
}: {
  setSelectedOption: (option: string) => void;
}) => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalVisits: 0,
    totalPayments: 0,
  });

  const [notifications, setNotifications] = useState([
    { message: "New patient registration: John Doe", time: "2 hours ago" },
    {
      message: "Appointment for Jane Smith at 3 PM tomorrow",
      time: "1 day ago",
    },
    { message: "Reminder: Patient payment due", time: "3 days ago" },
  ]);

  const loadStats = () => {
    // Simulate fetching data from the backend
    setStats({
      totalPatients: 120,
      totalVisits: 350,
      totalPayments: 15350,
    });
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="home">
      <h1>Welcome to the Dashboard</h1>
      <p>Select an option from the menu to get started.</p>

      {/* Dashboard Summary */}
      <section className="dashboard-summary">
        <div className="summary-item">
          <h3>{stats.totalPatients}</h3>
          <p>Total Patients</p>
        </div>
        <div className="summary-item">
          <h3>{stats.totalVisits}</h3>
          <p>Total Visits</p>
        </div>
        <div className="summary-item">
          <h3>${stats.totalPayments}</h3>
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
            onClick={() => setSelectedOption("/monthly-reports")}
          >
            <FontAwesomeIcon icon={faChartBar} />
            View Reports
          </button>
          <button
            className="action-btn"
            onClick={() => setSelectedOption("/record-new-visit")}
          >
            <FontAwesomeIcon icon={faCalendarAlt} />
            {/* View Appointments */}
            Record New Visit
          </button>
        </div>
      </section>

      {/* Notifications */}
      <section className="notifications">
        <h3>Recent Notifications</h3>
        <ul>
          {notifications.map((notification, index) => (
            <li key={index}>
              <p>{notification.message}</p>
              <span>{notification.time}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Home;
