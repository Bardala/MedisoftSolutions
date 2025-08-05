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
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { callPatientForDoctor, handleSpeakName } from "../utils/speakUtils";
import { useIntl } from "react-intl";
import { DoctorSelect } from "./DoctorSelect";
import { useDoctorSelection } from "../hooks/useDoctors";
import { useNavToPatient } from "../hooks/useNavToPatient";

const QueuePage: React.FC = () => {
  const { formatMessage: f } = useIntl();
  const navToPatient = useNavToPatient();
  const { selectedDoctorId } = useDoctorSelection();
  const { queue, isLoading: isLoadingQueue } = useFetchQueue(selectedDoctorId);
  const { updateStatusMutation } = useUpdateQueueStatus(selectedDoctorId);
  const { removePatientMutation } = useRemovePatientFromQueue(selectedDoctorId);
  const { updatePositionMutation } = useUpdateQueuePosition(selectedDoctorId);
  const isLoading =
    isLoadingQueue ||
    removePatientMutation.isLoading ||
    updatePositionMutation.isLoading;
  const handleStatusChange = (queueId: number, status: QueueStatus) => {
    updateStatusMutation.mutate({ queueId, status });

    // Speak the patient's name when status is updated to "IN_PROGRESS"
    // if (status === "IN_PROGRESS") {
    //   const queueEntry = queue?.find((entry) => entry.id === queueId);
    //   if (queueEntry) {
    //     callPatientForDoctor(queueEntry.patientName);
    //   }
    // }
  };

  const handleRemovePatient = (queueId: number) => {
    removePatientMutation.mutate({ queueId });
  };

  const handleUpdatePosition = (queueId: number, newPosition: number) => {
    updatePositionMutation.mutate({ queueId, newPosition });
  };

  return (
    <div className="queue-page">
      <h1>
        <FontAwesomeIcon icon={faUsers} /> {f({ id: "waitList" })}
        {<DoctorSelect />}
      </h1>

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
                      disabled={index === 0 || isLoading}
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
                      disabled={index === queue.length - 1 || isLoading}
                      onClick={() =>
                        handleUpdatePosition(entry.id, entry.position + 1)
                      }
                      title={f({ id: "moveDown" })}
                    >
                      ▼
                    </button>
                  </div>
                </td>
                <td
                  tabIndex={index}
                  className="clickable-cell"
                  onClick={() => navToPatient(entry.patientId)}
                >
                  {entry.patientName}
                </td>
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
                    disabled={isLoading}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                  {/* Add Speak Button */}
                  <button
                    className="action-button speak-button"
                    onClick={() =>
                      handleSpeakName(
                        entry.patientName,
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
