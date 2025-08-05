import React, { useState } from "react";
import { useDeleteVisit, useGetAppointmentsByWeek } from "../hooks/useVisit";
import { format, startOfWeek, addDays, isToday } from "date-fns";
import "../styles/appointmentCalender.css";
import Table, { Column } from "./Table";
import { useIntl } from "react-intl";
import { Visit } from "../types";
import { dailyTimeFormate, monthlyTimeFormate } from "../utils";
import { useAddPatientToQueue } from "../hooks/useQueue";
import { buildRoute } from "../utils/routeUtils";
import { useNavigate } from "react-router-dom";

export const AppointmentsCalendar: React.FC = () => {
  const { formatMessage: f } = useIntl();
  const nav = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const { appointments: weeklyVisits } = useGetAppointmentsByWeek(
    startOfWeek(currentDate),
  );
  const { deleteVisitMutation } = useDeleteVisit();
  const addPatientToQueue = useAddPatientToQueue();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: Column<any>[] = [
    {
      header: f({ id: "appointments.patientName" }),
      accessor: (v: Visit) => v.patientName,
      clickable: () => true,
      onClick: (v: Visit) => {
        nav(buildRoute("PATIENT_PAGE", { id: String(v.patientId) }));
      },
    },
    {
      header: f({ id: "appointments.visitTime" }),
      accessor: (v: Visit) => dailyTimeFormate(v.scheduledTime),
    },
    {
      header: f({ id: "appointments.doctorName" }),
      accessor: (v: Visit) => v.doctorName,
    },
    {
      header: f({ id: "appointments.reason" }),
      accessor: "reason",
      expandable: true,
    },
    {
      header: f({ id: "appointments.registrationTime" }),
      accessor: (v: Visit) => monthlyTimeFormate(v.createdAt),
      expandable: true,
    },
    {
      header: f({ id: "appointments.addToWaitList" }),
      accessor: (v: Visit) => v.patientName,
      clickable: (v: Visit) => isToday(v.scheduledTime),
      onClick: (v: Visit) => {
        addPatientToQueue.mutate({
          doctorId: v.doctorId,
          patientId: v.patientId,
          assistantId: v.assistantId,
        });
      },
      expandable: true,
    },
  ];

  return (
    <div className="appointments-calendar">
      <div className="calendar-controls">
        <div className="date-navigation">
          <button onClick={() => setCurrentDate(addDays(currentDate, -7))}>
            {f({ id: "appointments.previousWeek" })}
          </button>
          <span>
            {`${format(startOfWeek(currentDate), "MMM d")} - 
              ${format(addDays(startOfWeek(currentDate), 6), "MMM d, yyyy")}`}
          </span>
          <button onClick={() => setCurrentDate(addDays(currentDate, 7))}>
            {f({ id: "appointments.nextWeek" })}
          </button>
        </div>
      </div>

      <div className="week-view">
        {[0, 1, 2, 3, 4, 5, 6].map((dayOffset) => {
          const day = addDays(startOfWeek(currentDate), dayOffset);
          const dayVisits = weeklyVisits.filter(
            (v) =>
              new Date(v.scheduledTime).toDateString() === day.toDateString(),
          );

          return (
            <div
              key={dayOffset}
              className={`week-day ${isToday(day) ? "current-day" : ""}`}
            >
              <h3>
                {format(day, "EEEE")}, <span>{format(day, "MMM d")}</span>
              </h3>
              {dayVisits.length > 0 ? (
                <Table
                  columns={columns}
                  data={dayVisits}
                  onDelete={deleteVisitMutation.mutate}
                  // onUpdate={addPatientToQueue.mutate}
                  enableActions={true}
                />
              ) : (
                <p className="no-appointments">
                  {f({ id: "appointments.noAppointments" })}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
