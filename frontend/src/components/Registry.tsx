import React, { useState } from "react";
import "../styles/registry.css";
import { patientsHistory } from "../db/patientDb";
import PatientSearch from "./PatientSearch";
import { Patient } from "../types";
import { usePatientSearch } from "../hooks/usePatientSearch";

const Registry = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPatients, setFilteredPatients] = useState(patientsHistory);
  const [expandedVisit, setExpandedVisit] = useState(null);
  const [activeTab, setActiveTab] = useState("summary"); // New tab state
  const { selectedPatient, handlePatientSelect } = usePatientSearch();

  // Search handler
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    if (query) {
      setFilteredPatients(
        patientsHistory.filter(
          (patient) =>
            patient.name.toLowerCase().includes(query) ||
            patient.phone.includes(query),
        ),
      );
    } else {
      setFilteredPatients(patientsHistory);
    }
  };

  // Expand or collapse visit details
  const toggleExpandVisit = (visitId) => {
    setExpandedVisit(expandedVisit === visitId ? null : visitId);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return amount.replace(/[^\d.-]/g, ""); // Remove non-numeric characters
  };

  return (
    <div className="patient-history">
      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* Patient Summary */}
      {filteredPatients.length > 0 ? (
        filteredPatients.map((patient, patientIndex) => (
          <div key={patientIndex} className="patient-summary">
            <h3>{patient.name}</h3>
            <p>
              <strong>Phone:</strong> {patient.phone}
            </p>
            <p>
              <strong>Email:</strong> {patient.email}
            </p>

            {/* Tabs for Patient Details and Visit History */}
            <div className="tabs">
              <button
                className={activeTab === "summary" ? "active" : ""}
                onClick={() => setActiveTab("summary")}
              >
                Patient Details
              </button>
              <button
                className={activeTab === "history" ? "active" : ""}
                onClick={() => setActiveTab("history")}
              >
                Visit History
              </button>
            </div>

            {/* Content based on active tab */}
            {activeTab === "summary" && (
              <>
                <p>
                  <strong>Date of Birth:</strong> {patient.dateOfBirth}
                </p>
                <p>
                  <strong>Emergency Contact:</strong> {patient.emergencyContact}
                </p>
                <p>
                  <strong>Allergies:</strong>{" "}
                  {patient.allergies.join(", ") || "None"}
                </p>
                <p>
                  <strong>Medical History:</strong>{" "}
                  {patient.medicalHistory.join(", ") || "None"}
                </p>
                <p>
                  <strong>Outstanding Balance:</strong>{" "}
                  {patient.outstandingBalance}
                </p>
              </>
            )}

            {activeTab === "history" && (
              <div className="visit-history">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Procedure</th>
                      <th>Amount Paid</th>
                      <th>Feedback</th>
                      <th>Balance Due</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(patient.visitsHistory).map(
                      (visit, index) => (
                        <tr key={index}>
                          {/* <td>{visit.date}</td>
                          <td>{visit.time}</td>
                          <td>{visit.procedure}</td>
                          <td>{formatCurrency(visit.amountPaid)}</td>
                          <td>{visit.feedback || "None"}</td>
                          <td>{visit.amountDue || "None"}</td> */}
                          <td>
                            <button onClick={() => toggleExpandVisit(index)}>
                              {expandedVisit === index ? "Collapse" : "Expand"}
                            </button>
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>

                {expandedVisit !== null && (
                  <div className="expanded-visit-details">
                    <h5>Visit Details</h5>
                    <p>
                      {/* <strong>Duration:</strong>{" "}
                      {
                        Object.values(patient.visitsHistory)[expandedVisit]
                          .duration
                      } */}
                    </p>
                    <p>
                      {/* <strong>Feedback:</strong>{" "}
                      {
                        Object.values(patient.visitsHistory)[expandedVisit]
                          .feedback
                      } */}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No patients found matching your search criteria.</p>
      )}
    </div>
  );
};

export default Registry;
