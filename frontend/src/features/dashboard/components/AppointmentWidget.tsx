import { FC } from "react";
import { useIntl } from "react-intl";
import { useGetAppointmentsByWeek } from "@/features/visits";
import { startOfWeek, isToday, format } from "date-fns";
import {
  faCalendarCheck,
  faClock,
  faUser,
  faStethoscope,
  faPlus,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FeatureWidget } from "./FeatureWidget";
import { useNavigate } from "react-router-dom";
import { buildRoute } from "@/shared";
import "@styles/appointmentWidget.css";
import { VisitResDTO } from "@/dto";
import { AppRoutes } from "@/app/constants";
import { useAddPatientToQueue, useFetchQueue } from "@/features/queue";
import { useDoctorSelection } from "@/features/clinic-management";

export const AppointmentWidget: FC = () => {
  const { formatMessage: f } = useIntl();
  const { appointments } = useGetAppointmentsByWeek(startOfWeek(new Date()));
  const navigate = useNavigate();
  const addPatientToQueue = useAddPatientToQueue();
  const { selectedDoctorId } = useDoctorSelection();
  const { queue } = useFetchQueue(selectedDoctorId);

  // Filter appointments for today and sort by scheduled time
  const todayAppointments = appointments
    .filter((appointment) => {
      if (!appointment.scheduledTime) return false;
      const appointmentDate = new Date(appointment.scheduledTime);
      return isToday(appointmentDate);
    })
    .sort((a, b) => {
      const timeA = new Date(a.scheduledTime || 0).getTime();
      const timeB = new Date(b.scheduledTime || 0).getTime();
      return timeA - timeB;
    })
    .slice(0, 5); // Get only the nearest 5 appointments

  // Check if a patient is already in queue
  const isPatientInQueue = (patientId: number): boolean => {
    return queue?.some((q) => q.patientId === patientId) || false;
  };

  const handleAppointmentClick = (appointment: VisitResDTO) => {
    navigate(
      buildRoute("PATIENT_PAGE", {
        id: String(appointment.patientId),
      }),
    );
  };

  const handleAddToWaitList = (
    e: React.MouseEvent,
    appointment: VisitResDTO,
  ) => {
    e.stopPropagation();
    if (!isPatientInQueue(appointment.patientId)) {
      addPatientToQueue.mutate({
        doctorId: appointment.doctorId,
        patientId: appointment.patientId,
        assistantId: appointment.assistantId,
      });
    }
  };

  return (
    <FeatureWidget
      title={f({ id: "upcomingAppointments" })}
      icon={faCalendarCheck}
      color="var(--primary-color)"
      badge={todayAppointments.length}
      className="appointment-widget"
      route={AppRoutes.APPOINTMENT_CALENDER}
    >
      {todayAppointments.length > 0 ? (
        <div className="appointments-list">
          {todayAppointments.map((appointment, index) => (
            <div
              key={appointment.id}
              className="appointment-item clickable"
              onClick={() => handleAppointmentClick(appointment)}
            >
              <div className="appointment-index">
                <span className="index-badge">{index + 1}</span>
              </div>

              <div className="appointment-info">
                <div className="appointment-header">
                  <p className="patient-name">{appointment.patientName}</p>
                  <span className="appointment-time">
                    <FontAwesomeIcon icon={faClock} />
                    {appointment.scheduledTime
                      ? format(new Date(appointment.scheduledTime), "HH:mm")
                      : "-"}
                  </span>
                </div>

                <div className="appointment-details">
                  <span className="detail-item">
                    <FontAwesomeIcon icon={faUser} />
                    <span className="label">{f({ id: "phone" })}:</span>
                    {appointment.patientPhone}
                  </span>
                  <span className="detail-item">
                    <FontAwesomeIcon icon={faStethoscope} />
                    <span className="label">{f({ id: "doctor" })}:</span>
                    {appointment.doctorName}
                  </span>
                </div>

                {appointment.reason && (
                  <div className="appointment-reason">
                    <p>{appointment.reason}</p>
                  </div>
                )}

                <button
                  className={`add-to-waitlist-btn ${
                    isPatientInQueue(appointment.patientId) ? "in-queue" : ""
                  }`}
                  onClick={(e) => handleAddToWaitList(e, appointment)}
                  disabled={
                    addPatientToQueue.isPending ||
                    isPatientInQueue(appointment.patientId)
                  }
                  title={
                    isPatientInQueue(appointment.patientId)
                      ? f({ id: "appointments.patientInQueue" })
                      : f({ id: "appointments.addToWaitList" })
                  }
                >
                  <FontAwesomeIcon
                    icon={
                      isPatientInQueue(appointment.patientId) ? faCheck : faPlus
                    }
                  />
                  <span>
                    {isPatientInQueue(appointment.patientId)
                      ? f({ id: "appointments.inQueue" })
                      : f({ id: "appointments.addToWaitList" })}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <FontAwesomeIcon icon={faCalendarCheck} />
          <p>{f({ id: "noAppointmentsToday" })}</p>
        </div>
      )}
    </FeatureWidget>
  );
};
