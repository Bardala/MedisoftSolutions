import React from "react";
import "../styles/cardComponents.css";
import { patientsList } from "../db/patientDb";

const PatientList = () => {
  return (
    <div className="card-container">
      <h2>Patient List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Visits</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patientsList.map((patient, index) => (
            <tr key={index}>
              <td>{patient.name}</td>
              <td>{patient.phone}</td>
              <td>{patient.visits}</td>
              <td>
                <button>View</button>
                <button>Edit</button>
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientList;
