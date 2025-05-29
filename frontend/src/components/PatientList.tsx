import "../styles/cardComponents.css";
import { useDailyReportData } from "../hooks/useDailyReportData";
import { dailyTimeFormate } from "../utils";

// todo: Add visit dental procedure, and queueing in database.
// todo: Use Table component.
const PatientList = () => {
  const { visits } = useDailyReportData();

  return (
    <div className="card-container">
      <h2>Patient List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {visits?.length > 0 &&
            visits?.map((visit, index) => (
              <tr key={index}>
                <td>{visit.patientName}</td>
                <td>{visit.patientPhone}</td>
                <td>{dailyTimeFormate(visit.createdAt)}</td>
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
