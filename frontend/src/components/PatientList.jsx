import React from "react";
import "../styles/cardComponents.css";

const PatientList = () => {
  const patients = [
    { name: "John Doe", phone: "1234567890", visits: 5 },
    { name: "Jane Smith", phone: "9876543210", visits: 3 },
  ];

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
          {patients.map((patient, index) => (
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
