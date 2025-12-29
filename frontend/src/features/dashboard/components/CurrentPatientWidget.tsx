import { AppRoutes } from "@/app/constants";
import { useDoctorSelection } from "@/features/clinic-management";
import { useFetchQueue } from "@/features/queue";
import {
  faUser,
  faCalendarAlt,
  faPhone,
  faClock,
  faHistory,
  faNotesMedical,
  faProcedures,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC } from "react";
import { useIntl } from "react-intl";
import { FeatureWidget } from "./FeatureWidget";
import { SimpleAvatar } from "./SimpleAvatar";
import "@styles/currentPatientWidget.css";
import { CurrentPatient } from "@/shared/hooks/useCurrentPatientCard";
import { VisitResDTO } from "@/dto";
import { useNavigate } from "react-router-dom";
import { buildRoute } from "@/shared";

export const CurrentPatientWidget: FC<{
  currentPatient: CurrentPatient;
  lastVisit: VisitResDTO;
}> = ({ currentPatient, lastVisit }) => {
  const { formatMessage: f } = useIntl();
  const { selectedDoctorId } = useDoctorSelection();
  const { queue } = useFetchQueue(selectedDoctorId);
  const nav = useNavigate();

  return (
    <FeatureWidget
      title={f({ id: "currentPatient" })}
      icon={faUser}
      color="var(--primary-color)"
      route={AppRoutes.PATIENT_PROFILE}
      className="current-patient-widget"
      badge={
        queue?.findIndex((p) => p.patientId === currentPatient?.id) === 0
          ? 1
          : undefined
      }
    >
      {currentPatient ? (
        <div className="current-patient-content">
          <div
            className="patient-header clickable"
            onClick={() =>
              nav(
                buildRoute("PATIENT_PAGE", {
                  id: String(currentPatient.id),
                }),
              )
            }
          >
            <SimpleAvatar name={currentPatient.fullName} size="lg" />
            <div className="patient-info">
              <h4 className="patient-name">{currentPatient.fullName}</h4>
              <div className="patient-meta">
                <span className="patient-age">
                  <FontAwesomeIcon icon={faCalendarAlt} />{" "}
                  {currentPatient.age || "--"} {f({ id: "years" })}
                </span>
                <span className="patient-phone">
                  <FontAwesomeIcon icon={faPhone} /> {currentPatient.phone}
                </span>
              </div>
            </div>
          </div>

          <div className="patient-visits-container">
            {/* Current Visit Card */}
            <div className="visit-card current-visit">
              <div className="visit-card-header">
                <div className="visit-icon">
                  <FontAwesomeIcon icon={faClock} />
                </div>
                <h5>{f({ id: "currentVisitDetails" })}</h5>
                <span className="visit-time">
                  {currentPatient.currentVisit?.arrivedAt || "--:--"}
                </span>
              </div>
              <div className="visit-card-body">
                <div className="visit-info">
                  <span className="visit-label">
                    {f({ id: "visitReason" })}:
                  </span>
                  <span className="visit-value">
                    {currentPatient.currentVisit?.reason || "-"}
                  </span>
                </div>
                <div className="visit-info">
                  <span className="visit-label">{f({ id: "status" })}:</span>
                  <span className="visit-status-badge in-progress">
                    {f({ id: "in_progress" })}
                  </span>
                </div>
                <div className="visit-info">
                  <span className="visit-label">
                    {f({ id: "doctorName" })}:
                  </span>
                  <span className="visit-value">
                    {currentPatient.currentVisit?.doctorName || "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* Last Visit Card */}
            {lastVisit && (
              <div className="visit-card last-visit">
                <div className="visit-card-header">
                  <div className="visit-icon">
                    <FontAwesomeIcon icon={faHistory} />
                  </div>
                  <h5>{f({ id: "lastVisitDetails" })}</h5>
                  <span className="visit-time">
                    {lastVisit.createdAt
                      ? new Date(lastVisit.createdAt).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
                <div className="visit-card-body">
                  <div className="visit-info">
                    <span className="visit-label">{f({ id: "notes" })}:</span>
                    <span className="visit-value visit-notes">
                      {lastVisit.doctorNotes
                        ? lastVisit.doctorNotes?.substring(0, 50) +
                          (lastVisit.doctorNotes?.length > 50 ? "..." : "")
                        : "-"}
                    </span>
                  </div>
                  <div className="visit-info">
                    <span className="visit-label">
                      {f({ id: "visitReason" })}:
                    </span>
                    <span className="visit-value">
                      {lastVisit.reason || f({ id: "not_recorded" })}
                    </span>
                  </div>
                  <div className="visit-info">
                    {/* <span className="visit-label">
                      {f({ id: "duration" })}:
                    </span>
                    <span className="visit-value">
                      {lastVisit.duration
                        ? `${lastVisit.duration} ${f({ id: "minutes" })}`
                        : f({ id: "not_recorded" })}
                    </span> */}
                  </div>
                  <div className="visit-info">
                    {/* <span className="visit-label">
                      {f({ id: "procedures" })}:
                    </span>
                    <span className="visit-value">
                      {lastVisit.procedures?.length > 0
                        ? `${lastVisit.procedures.length} ${f({
                            id: "procedures",
                          })}`
                        : f({ id: "none" })}
                    </span> */}
                  </div>
                </div>
              </div>
            )}

            {/* No Last Visit State */}
            {!lastVisit && (
              <div className="no-last-visit">
                <FontAwesomeIcon icon={faHistory} className="no-visit-icon" />
                <span>{f({ id: "first_visit" })}</span>
              </div>
            )}
          </div>

          {/* Quick Medical History Summary */}
          {currentPatient.medicalHistory && (
            <div className="medical-history-summary">
              <div className="summary-header">
                <FontAwesomeIcon icon={faNotesMedical} />
                <span>{f({ id: "patient_medical_history" })}</span>
              </div>
              <p className="summary-text">
                {currentPatient.medicalHistory.substring(0, 100)}
                {currentPatient.medicalHistory.length > 100 ? "..." : ""}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="empty-state">
          <FontAwesomeIcon icon={faProcedures} className="empty-icon" />
          <p>{f({ id: "noCurrentPatient" })}</p>
          <small>{f({ id: "waiting_for_patient" })}</small>
        </div>
      )}
    </FeatureWidget>
  );
};
