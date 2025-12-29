import { AppRoutes } from "@/app/constants";
import { useDailyReportData, useTrendAnalysis } from "@/features/reports";
import { useGetAppointmentsByWeek } from "@/features/visits";
import { buildRoute } from "@/shared";
import { startOfWeek, isToday } from "date-fns";
import { useIntl } from "react-intl";
import "@styles/dashboardSummary.css";
import { useCurrentPatientCard } from "@/shared/hooks/useCurrentPatientCard";
import {
  faUserPlus,
  faDollarSign,
  faHospital,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useDoctorSelection } from "@/features/clinic-management";
import { useFetchQueue } from "@/features/queue";
import { StatsWidget } from "./StatsWidget";
import { WaitListWidget } from "./WaitListWidget";
import { CurrentPatientWidget } from "./CurrentPatientWidget";
import { MonthlySummaryWidget } from "./MonthlySummaryWidget";
import { AlertsWidget } from "./AlertsWidget";
import { QuickActions } from "./QuickActions";
import { AppointmentWidget } from "./AppointmentWidget";

export const DashboardSummary = () => {
  const { formatMessage: f } = useIntl();
  const today = new Date().toISOString().split("T")[0];
  const { appointments } = useGetAppointmentsByWeek(startOfWeek(new Date()));
  const dailyAppointmentsNum = appointments.filter((a) =>
    isToday(a.scheduledTime),
  ).length;
  const { patients, visits, totalPayments, isLoading, isError } =
    useDailyReportData();
  const { patientsTrend, revenueTrend, visitsTrend } = useTrendAnalysis();
  const { currentPatient, lastVisit } = useCurrentPatientCard();
  const { selectedDoctorId } = useDoctorSelection();
  const { queue } = useFetchQueue(selectedDoctorId);

  return (
    <div className="dashboard-widgets-container">
      {/* Stats Widgets */}
      <div className="stats-widgets-grid">
        <StatsWidget
          title={f({ id: "daily_patients" })}
          value={patients?.length || 0}
          icon={faUserPlus}
          color="var(--primary-color)"
          route={buildRoute("REPORTS", { date: today })}
          trend={patientsTrend}
        />
        <StatsWidget
          title={f({ id: "total_payments" })}
          value={`${totalPayments || 0} ${f({ id: "L.E" })}`}
          icon={faDollarSign}
          color="var(--success-text)"
          route={buildRoute("REPORTS", { date: today })}
          trend={revenueTrend}
        />
        <StatsWidget
          title={f({ id: "total_visits" })}
          value={visits?.length || 0}
          icon={faHospital}
          color="var(--third-color)"
          route={buildRoute("REPORTS", { date: today })}
          trend={visitsTrend}
        />
        <StatsWidget
          title={f({ id: "total_appointments" })}
          value={dailyAppointmentsNum || 0}
          icon={faCalendarAlt}
          color="var(--fourth-color)"
          route={AppRoutes.APPOINTMENT_CALENDER}
          // trend={`${
          //   appointmentsTrendCount > 0 ? "+" : ""
          // }${appointmentsTrendCount}`}
        />
      </div>

      <QuickActions />

      {/* Feature Widgets */}
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
