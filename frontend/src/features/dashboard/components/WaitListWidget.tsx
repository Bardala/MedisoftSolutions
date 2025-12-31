import { AppRoutes } from "@/app/constants";
import { QueueResDTO } from "@/dto";
import {
  faUsers,
  faClock,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, useRef, useEffect } from "react";
import { useIntl } from "react-intl";
import { FeatureWidget } from "./FeatureWidget";
import "@styles/waitListWidget.css";
import { useNavigate } from "react-router-dom";
import { buildRoute } from "@/shared";

export const WaitListWidget: FC<{ queue: QueueResDTO[] }> = ({ queue }) => {
  const { formatMessage: f } = useIntl();
  const topPatients = queue || [];
  const nav = useNavigate();
  const waitlistContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to show new patients in queue
  useEffect(() => {
    if (waitlistContainerRef.current && topPatients.length > 0) {
      const scrollDelay = setTimeout(() => {
        const container = waitlistContainerRef.current;
        if (container) {
          // Scroll to the top to show the first patient in queue
          container.scrollTop = 0;
        }
      }, 300);
      return () => clearTimeout(scrollDelay);
    }
  }, [topPatients.length]);

  return (
    <FeatureWidget
      title={f({ id: "waitList" })}
      icon={faUsers}
      color="var(--third-color)"
      route={AppRoutes.PATIENTS}
      badge={queue?.length || 0}
      className="waitlist-widget"
    >
      {topPatients.length > 0 ? (
        <div className="waitlist-content" ref={waitlistContainerRef}>
          {topPatients.map((patient, index) => (
            <div
              key={patient.id}
              className="queue-item clickable"
              onClick={() =>
                nav(
                  buildRoute("PATIENT_PAGE", {
                    id: String(patient.patientId),
                  }),
                )
              }
            >
              <div className="queue-position">
                <span className="position-badge">{index + 1}</span>
              </div>
              <div className="queue-patient-info">
                <p className="patient-name">{patient.patientName}</p>
                <div className="queue-details">
                  <span className="arrival-time">
                    <FontAwesomeIcon icon={faClock} />
                    {new Date(patient.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {patient.estimatedWaitTime && (
                    <span className="wait-time">
                      ~{patient.estimatedWaitTime} {f({ id: "minutes" })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <FontAwesomeIcon icon={faChartLine} />
          <p>{f({ id: "noPatientsInQueue" })}</p>
        </div>
      )}
    </FeatureWidget>
  );
};
