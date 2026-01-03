import { useLogin } from "@/app";
import { AppRoutes } from "@/app/constants";
import { useTrendAnalysis, useDailyReportData } from "@/features/reports";
import { useGetAppointmentsByDay } from "@/features/visits";
import { isNotDoctorRole, buildRoute } from "@/shared";
import {
  faUserPlus,
  faDollarSign,
  faHospital,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { isToday } from "date-fns";
import { FC } from "react";
import { useIntl } from "react-intl";
import { StatsWidget } from "./StatsWidget";

export const StatsWidgets: FC = () => {
  const { formatMessage: f } = useIntl();
  const { loggedInUser } = useLogin();
  const today = new Date().toISOString().split("T")[0];
  const { appointments } = useGetAppointmentsByDay(new Date());
  const dailyAppointmentsNum = appointments.filter((a) =>
    isToday(a.scheduledTime),
  ).length;
  const { patientsTrend, revenueTrend, visitsTrend } = useTrendAnalysis();
  const { patients, visits, totalPayments } = useDailyReportData();

  return (
    <div className="stats-widgets-grid">
      {isNotDoctorRole(loggedInUser.role) && (
        <StatsWidget
          title={f({ id: "daily_patients" })}
          value={patients?.length || 0}
          icon={faUserPlus}
          color="var(--primary-color)"
          route={buildRoute("REPORTS", { date: today })}
          trend={patientsTrend}
        />
      )}
      {isNotDoctorRole(loggedInUser.role) && (
        <StatsWidget
          title={f({ id: "total_payments" })}
          value={`${totalPayments || 0} ${f({ id: "L.E" })}`}
          icon={faDollarSign}
          color="var(--success-text)"
          route={buildRoute("REPORTS", { date: today })}
          trend={revenueTrend}
        />
      )}
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
      />
    </div>
  );
};
