import {
  faPlay,
  faCheckCircle,
  faTrashAlt,
  faVolumeUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useIntl } from "react-intl";
import {
  useUpdateQueueStatus,
  useRemovePatientFromQueue,
} from "../hooks/useQueue";
import { QueueEntry, QueueStatus } from "../types";
import { handleSpeakName } from "../utils";

export interface QueueActionsProps {
  compact?: boolean;
  selectedDoctorId: number;
  entry: QueueEntry;
}

export const QueueActions = ({
  selectedDoctorId,
  entry,
  compact = false,
}: QueueActionsProps) => {
  const { formatMessage: f } = useIntl();
  const { updateStatusMutation } = useUpdateQueueStatus(selectedDoctorId);
  const { removePatientMutation } = useRemovePatientFromQueue(selectedDoctorId);
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
  const isLoading =
    updateStatusMutation.isLoading || removePatientMutation.isLoading;

  return (
    <div className={`queue-actions ${compact ? "compact" : ""}`}>
      {entry.position === 1 && entry.status === "WAITING" && (
        <button
          className="action-button"
          onClick={() => handleStatusChange(entry.id, "IN_PROGRESS")}
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
          handleSpeakName(entry.patientName, entry.position, entry.status)
        }
        title={f({ id: "callPatient" })}
      >
        <FontAwesomeIcon icon={faVolumeUp} />
      </button>
    </div>
  );
};
