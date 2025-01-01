import React, { useState } from "react";
import "../styles/cardComponents.css";

const ManageRoles = () => {
  const [waitingList, setWaitingList] = useState([
    { id: 1, name: "John Doe", priority: false },
    { id: 2, name: "Jane Smith", priority: false },
  ]);
  const [newPatient, setNewPatient] = useState("");

  const handlePriority = (id) => {
    setWaitingList((prev) =>
      prev.map((patient) =>
        patient.id === id
          ? { ...patient, priority: !patient.priority }
          : patient,
      ),
    );
  };

  const addPatientToList = () => {
    if (newPatient.trim()) {
      setWaitingList((prev) => [
        ...prev,
        { id: Date.now(), name: newPatient, priority: false },
      ]);
      setNewPatient("");
    }
  };

  return (
    <div className="card-container">
      <div className="manage-roles">
        <h2>Manage Roles</h2>
        <ul className="waiting-list">
          {waitingList.map((patient) => (
            <li key={patient.id} className={patient.priority ? "priority" : ""}>
              {patient.name}
              <button onClick={() => handlePriority(patient.id)}>
                {patient.priority ? "Remove Priority" : "Set Priority"}
              </button>
            </li>
          ))}
        </ul>
        <div className="add-patient">
          <input
            type="text"
            placeholder="Add Patient"
            value={newPatient}
            onChange={(e) => setNewPatient(e.target.value)}
          />
          <button onClick={addPatientToList}>Add</button>
        </div>
      </div>
    </div>
  );
};

export default ManageRoles;
