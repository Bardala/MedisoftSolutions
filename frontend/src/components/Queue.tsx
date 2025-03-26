import React from "react";
import {
  useFetchQueue,
  useRemovePatientFromQueue,
  useUpdateQueuePosition,
  useUpdateQueueStatus,
} from "../hooks/useQueue";
import { QueueStatus } from "../types";
import "../styles/queuePage.css";
import { dailyTimeFormate } from "../utils";
import {
  faPlay,
  faCheckCircle,
  faTrashAlt,
  faVolumeUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { callPatientForDoctor, handleSpeakName } from "../utils/speakUtils";
import { useIntl } from "react-intl";

const QueuePage: React.FC<{ doctorId: number }> = ({ doctorId }) => {
  const { formatMessage: f } = useIntl();
  const { queue, isLoading, isError } = useFetchQueue(doctorId);
  const { updateStatusMutation } = useUpdateQueueStatus(doctorId);
  const { removePatientMutation } = useRemovePatientFromQueue();
  const { updatePositionMutation } = useUpdateQueuePosition();

  const handleStatusChange = (queueId: number, status: QueueStatus) => {
    updateStatusMutation.mutate({ queueId, status });

    // Speak the patient's name when status is updated to "IN_PROGRESS"
    if (status === "IN_PROGRESS") {
      const patient = queue?.find((entry) => entry.id === queueId);
      if (patient) {
        callPatientForDoctor(patient.patient.fullName);
      }
    }
  };

  const handleRemovePatient = (queueId: number) => {
    removePatientMutation.mutate({ queueId });
  };

  const handleUpdatePosition = (queueId: number, newPosition: number) => {
    updatePositionMutation.mutate({ queueId, newPosition });
  };

  if (isLoading) return <div>{f({ id: "loading" })}</div>;
  if (isError) return <div>{f({ id: "error" })}</div>;

  return (
    <div className="queue-page">
      <h1>{f({ id: "waitList" })}</h1>

      {/* Queue List */}
      <div className="queue-table-container">
        <table className="queue-table">
          <thead>
            <tr>
              <th>{f({ id: "position" })}</th>
              <th>{f({ id: "patient" })}</th>
              <th>{f({ id: "arrivedIn" })}</th>
              <th>{f({ id: "actions" })}</th>
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
                      title={f({ id: "moveUp" })}
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
                      title={f({ id: "moveDown" })}
                    >
                      ▼
                    </button>
                  </div>
                </td>
                <td>{entry.patient.fullName}</td>
                <td>{dailyTimeFormate(entry.createdAt)}</td>
                <td>
                  {entry.position === 1 && entry.status === "WAITING" && (
                    <button
                      className="action-button"
                      onClick={() =>
                        handleStatusChange(entry.id, "IN_PROGRESS")
                      }
                      title={f({ id: "start" })}
                    >
                      <FontAwesomeIcon icon={faPlay} />
                    </button>
                  )}
                  {entry.status === "IN_PROGRESS" && (
                    <button
                      className="action-button"
                      onClick={() => handleStatusChange(entry.id, "COMPLETED")}
                      title={f({ id: "complete" })}
                    >
                      <FontAwesomeIcon icon={faCheckCircle} />
                    </button>
                  )}
                  <button
                    className="action-button danger"
                    onClick={() => handleRemovePatient(entry.id)}
                    title={f({ id: "remove" })}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                  {/* Add Speak Button */}
                  <button
                    className="action-button speak-button"
                    onClick={() =>
                      handleSpeakName(
                        entry.patient.fullName,
                        entry.position,
                        entry.status,
                      )
                    }
                    title={f({ id: "callPatient" })}
                  >
                    <FontAwesomeIcon icon={faVolumeUp} />
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
