import React from "react";
import { useFetchQueue, useUpdateQueuePosition } from "../hooks/useQueue";
import { QueueEntry } from "../types";
import "../styles/queuePage.css";
import { dailyTimeFormate } from "../utils";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useIntl } from "react-intl";
import { DoctorSelect } from "./DoctorSelect";
import { useDoctorSelection } from "../hooks/useDoctors";
import { useNavToPatient } from "../hooks/useNavToPatient";
import { QueueActions } from "./QueueActions";

const QueuePage: React.FC = () => {
  const { formatMessage: f } = useIntl();
  const navToPatient = useNavToPatient();
  const { selectedDoctorId } = useDoctorSelection();
  const { queue, isLoading: isLoadingQueue } = useFetchQueue(selectedDoctorId);

  const { updatePositionMutation } = useUpdateQueuePosition(selectedDoctorId);
  const isLoading = isLoadingQueue || updatePositionMutation.isLoading;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const showEstimatedWaitTime = (entry: QueueEntry) =>
    !(entry.status === "IN_PROGRESS" || entry.status === "COMPLETED");

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
              {/* <th>{f({ id: "estimatedWaitTime" })}</th> */}
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
                {/* <td>
                  {showEstimatedWaitTime(entry) && entry.estimatedWaitTime
                    ? `${entry.estimatedWaitTime} ${f({ id: "minutes" })}`
                    : ""}
                </td> */}
                <td>
                  <QueueActions
                    selectedDoctorId={selectedDoctorId}
                    entry={entry}
                  />
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
