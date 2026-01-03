import { useGetAppointmentsByDay } from "@/features/visits";
import { isDoctorOrOwnerRole, isNotDoctorRole, sortById } from "@/shared";
import "@styles/dashboardSummary.css";
import { useCurrentPatientCard } from "@/shared/hooks/useCurrentPatientCard";
import { useDoctorSelection } from "@/features/clinic-management";
import { useFetchQueue } from "@/features/queue";
import {
  AlertsWidget,
  AppointmentWidget,
  CurrentPatientWidget,
  MonthlySummaryWidget,
  QuickActions,
  StatsWidgets,
  WaitListWidget,
} from ".";
import { useGetDailyPatients } from "@/features/patients";
import { useLogin } from "@/app";

export const DashboardSummary = () => {
  const { appointments } = useGetAppointmentsByDay(new Date());
  const dailyAppointmentsNum = appointments.length;
  const { dailyNewPatientsQuery, isLoading, isError } = useGetDailyPatients(
    new Date().toISOString().split("T")[0],
  );
  const { loggedInUser } = useLogin();

  const patients = sortById(dailyNewPatientsQuery.data);

  const { currentPatient, lastVisit } = useCurrentPatientCard();
  const { selectedDoctorId } = useDoctorSelection();
  const { queue } = useFetchQueue(selectedDoctorId);
  const MonthlySummaryFC = isDoctorOrOwnerRole(loggedInUser.role) && (
    <MonthlySummaryWidget />
  );
  const QuickActionsFC = isNotDoctorRole(loggedInUser.role) && <QuickActions />;

  return (
    <div className="dashboard-widgets-container">
      <StatsWidgets />
      {QuickActionsFC}

      <div className="feature-widgets-grid">
        <CurrentPatientWidget
          currentPatient={currentPatient}
          lastVisit={lastVisit}
        />
        <WaitListWidget queue={queue} />
        <AppointmentWidget />
        {MonthlySummaryFC}
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
