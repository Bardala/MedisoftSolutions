import React from "react";
import { useQueue } from "../hooks/useQueue";
import { QueueStatus } from "../types";
import "../styles/queuePage.css";
import { dailyTimeFormate } from "../utils";
import {
  faPlay,
  faCheckCircle,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const QueuePage: React.FC<{ doctorId: number }> = ({ doctorId }) => {
  const {
    updatePositionMutation,
    removePatientMutation,
    updateStatusMutation,
    queue,
    isLoading,
    isError,
  } = useQueue(doctorId);

  const handleStatusChange = (queueId: number, status: QueueStatus) => {
    updateStatusMutation.mutate({ queueId, status });
  };

  const handleRemovePatient = (queueId: number) => {
    removePatientMutation.mutate({ queueId });
  };

  const handleUpdatePosition = (queueId: number, newPosition: number) => {
    updatePositionMutation.mutate({ queueId, newPosition });
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading queue</div>;

  return (
    <div className="queue-page">
      <h1>Wait List</h1>

      {/* Queue List */}
      <div className="queue-table-container">
        <table className="queue-table">
          <thead>
            <tr>
              <th>Position</th>
              <th>Patient</th>
              <th>Arrived In</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {queue?.map((entry, index) => (
              <tr key={entry.id}>
                <td className="position-cell">
                  <div className="position-controls">
                    <button
                      className="icon-button"
                      disabled={index === 0}
                      onClick={() =>
                        handleUpdatePosition(entry.id, entry.position - 1)
                      }
                      title="Move Up"
                    >
                      ▲
                    </button>
                    <span>{entry.position}</span>
                    <button
                      className="icon-button"
                      disabled={index === queue.length - 1}
                      onClick={() =>
                        handleUpdatePosition(entry.id, entry.position + 1)
                      }
                      title="Move Down"
                    >
                      ▼
                    </button>
                  </div>
                </td>
                <td>{entry.patient.fullName}</td>
                <td>{dailyTimeFormate(entry.createdAt)}</td>
                <td>
                  <span className={`status-tag ${entry.status.toLowerCase()}`}>
                    {entry.status}
                  </span>
                </td>

                <td>
                  {entry.position === 1 && entry.status === "WAITING" && (
                    <button
                      className="action-button"
                      onClick={() =>
                        handleStatusChange(entry.id, "IN_PROGRESS")
                      }
                      title="Start"
                    >
                      <FontAwesomeIcon icon={faPlay} />
                    </button>
                  )}
                  {entry.status === "IN_PROGRESS" && (
                    <button
                      className="action-button"
                      onClick={() => handleStatusChange(entry.id, "COMPLETED")}
                      title="Complete"
                    >
                      <FontAwesomeIcon icon={faCheckCircle} />
                    </button>
                  )}
                  <button
                    className="action-button danger"
                    onClick={() => handleRemovePatient(entry.id)}
                    title="Remove"
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QueuePage;
