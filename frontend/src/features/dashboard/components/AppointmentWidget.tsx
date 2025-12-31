import { FC, useRef, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useGetAppointmentsByDay } from "@/features/visits";
import { format } from "date-fns";
import {
  faCalendarCheck,
  faClock,
  faUser,
  faStethoscope,
  faPlus,
  faCheck,
  faHourglassHalf,
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
  const { formatMessage: f, locale } = useIntl();
  const { appointments: todayAppointments } = useGetAppointmentsByDay(
    new Date(),
  );
  const navigate = useNavigate();
  const addPatientToQueue = useAddPatientToQueue();
  const { selectedDoctorId } = useDoctorSelection();
  const { queue } = useFetchQueue(selectedDoctorId);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);

  const isPatientInQueue = (patientId: number): boolean => {
    return queue?.some((q) => q.patientId === patientId) || false;
  };

  const isRTL = locale === "ar";

  // Separate appointments into two groups: in queue and not in queue
  const appointmentsInQueue = todayAppointments.filter((appointment) =>
    isPatientInQueue(appointment.patientId),
  );

  const appointmentsNotInQueue = todayAppointments.filter(
    (appointment) => !isPatientInQueue(appointment.patientId),
  );

  // Combine with in-queue appointments first
  const sortedAppointments = [
    ...appointmentsInQueue,
    ...appointmentsNotInQueue,
  ];

  // Find the first appointment not in queue for auto-scrolling
  const firstNonQueuedAppointmentIndex = sortedAppointments.findIndex(
    (appointment) => !isPatientInQueue(appointment.patientId),
  );

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

  const firstNonQueuedRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the first non-queued appointment
  useEffect(() => {
    if (
      !scrollContainerRef.current ||
      !autoScrollEnabled ||
      !firstNonQueuedRef.current
    ) {
      return;
    }

    const scrollToElement = () => {
      const container = scrollContainerRef.current;
      const targetElement = firstNonQueuedRef.current;

      if (container && targetElement) {
        // Calculate scroll distance accounting for RTL/LTR
        if (isRTL) {
          // For RTL: calculate from the right side
          const elementOffsetFromRight =
            container.scrollWidth -
            (targetElement.offsetLeft + targetElement.offsetWidth);
          const containerWidth = container.clientWidth;
          const scrollTo =
            container.scrollWidth - containerWidth - elementOffsetFromRight + 8;

          container.scrollTo({
            left: scrollTo,
            behavior: "smooth",
          });
        } else {
          // For LTR: calculate from the left side
          const scrollTo = targetElement.offsetLeft - 8;
          container.scrollTo({
            left: scrollTo,
            behavior: "smooth",
          });
        }
      }
    };

    // Delay to ensure DOM is fully rendered
    const timer = setTimeout(scrollToElement, 150);
    return () => clearTimeout(timer);
  }, [autoScrollEnabled, isRTL, sortedAppointments]);

  // Handle manual scroll to disable auto-scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setScrollPosition(container.scrollLeft);
      if (
        autoScrollEnabled &&
        Math.abs(container.scrollLeft - scrollPosition) > 50
      ) {
        setAutoScrollEnabled(false);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [autoScrollEnabled, scrollPosition]);

  return (
    <FeatureWidget
      title={f({ id: "upcomingAppointments" })}
      icon={faCalendarCheck}
      color="var(--primary-color)"
      badge={appointmentsNotInQueue.length}
      className="appointment-widget"
      route={AppRoutes.APPOINTMENT_CALENDER}
    >
      {sortedAppointments.length > 0 ? (
        <>
          <div className="appointments-list" ref={scrollContainerRef}>
            {sortedAppointments.map((appointment, index) => {
              const inQueue = isPatientInQueue(appointment.patientId);
              const isFirstNonQueued = index === firstNonQueuedAppointmentIndex;

              return (
                <div
                  key={appointment.id}
                  ref={isFirstNonQueued ? firstNonQueuedRef : null}
                  className={`appointment-item clickable ${
                    inQueue ? "in-queue" : ""
                  } ${isFirstNonQueued ? "highlighted" : ""}`}
                  onClick={() => handleAppointmentClick(appointment)}
                  data-in-queue={inQueue}
                  data-first-non-queued={isFirstNonQueued}
                >
                  <div className="appointment-index">
                    <span
                      className={`index-badge ${inQueue ? "in-queue" : ""}`}
                    >
                      {inQueue ? <FontAwesomeIcon icon={faCheck} /> : index + 1}
                    </span>
                  </div>

                  <div className="appointment-info">
                    <div className="appointment-header">
                      <div className="patient-header-content">
                        <p className="patient-name">
                          {appointment.patientName}
                        </p>
                        {inQueue && (
                          <span className="queue-status-badge">
                            <FontAwesomeIcon icon={faHourglassHalf} />
                            {f({ id: "appointments.inQueue" })}
                          </span>
                        )}
                      </div>
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
                        inQueue ? "in-queue" : ""
                      }`}
                      onClick={(e) => handleAddToWaitList(e, appointment)}
                      disabled={addPatientToQueue.isPending || inQueue}
                      title={
                        inQueue
                          ? f({ id: "appointments.patientInQueue" })
                          : f({ id: "appointments.addToWaitList" })
                      }
                    >
                      <FontAwesomeIcon icon={inQueue ? faCheck : faPlus} />
                      <span>
                        {inQueue
                          ? f({ id: "appointments.inQueue" })
                          : f({ id: "appointments.addToWaitList" })}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <FontAwesomeIcon icon={faCalendarCheck} />
          <p>{f({ id: "noAppointmentsToday" })}</p>
        </div>
      )}
    </FeatureWidget>
  );
};
