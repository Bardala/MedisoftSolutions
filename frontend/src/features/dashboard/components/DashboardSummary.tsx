import { useGetAppointmentsByWeek } from "@/features/visits";
import { isNotDoctorRole, sortById } from "@/shared";
import { startOfWeek, isToday } from "date-fns";
import "@styles/dashboardSummary.css";
import { useCurrentPatientCard } from "@/shared/hooks/useCurrentPatientCard";
import { useDoctorSelection } from "@/features/clinic-management";
import { useFetchQueue } from "@/features/queue";
import { WaitListWidget } from "./WaitListWidget";
import { CurrentPatientWidget } from "./CurrentPatientWidget";
import { MonthlySummaryWidget } from "./MonthlySummaryWidget";
import { AlertsWidget } from "./AlertsWidget";
import { QuickActions } from "./QuickActions";
import { AppointmentWidget } from "./AppointmentWidget";
import { useGetDailyPatients } from "@/features/patients";
import { StatsWidgets } from "./StatsWidgets";
import { useLogin } from "@/app";

export const DashboardSummary = () => {
  const { appointments } = useGetAppointmentsByWeek(startOfWeek(new Date()));
  const dailyAppointmentsNum = appointments.filter((a) =>
    isToday(a.scheduledTime),
  ).length;
  const { dailyNewPatientsQuery, isLoading, isError } = useGetDailyPatients(
    new Date().toISOString().split("T")[0],
  );
  const { loggedInUser } = useLogin();

  const patients = sortById(dailyNewPatientsQuery.data);

  const { currentPatient, lastVisit } = useCurrentPatientCard();
  const { selectedDoctorId } = useDoctorSelection();
  const { queue } = useFetchQueue(selectedDoctorId);

  return (
    <div className="dashboard-widgets-container">
      <StatsWidgets />
      {isNotDoctorRole(loggedInUser.role) && <QuickActions />}

      <div className="feature-widgets-grid">
        <CurrentPatientWidget
          currentPatient={currentPatient}
          lastVisit={lastVisit}
        />
        <WaitListWidget queue={queue} />

        <AppointmentWidget />

        <MonthlySummaryWidget />
        <AlertsWidget
          isLoading={isLoading}
          isError={isError}
          dailyAppointmentsNum={dailyAppointmentsNum}
          patients={patients}
        />
      </div>
    </div>
  );
};
