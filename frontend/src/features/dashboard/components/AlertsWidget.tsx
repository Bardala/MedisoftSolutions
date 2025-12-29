import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FC } from "react";
import { useIntl } from "react-intl";
import { FeatureWidget } from "./FeatureWidget";
import { PatientResDTO } from "@/dto";
import "@styles/alertsWidget.css";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "@/app/constants";

export interface AlertsWidgetProps {
  isLoading: boolean;
  isError: boolean;
  dailyAppointmentsNum: number;
  patients: PatientResDTO[];
}

export const AlertsWidget: FC<AlertsWidgetProps> = (props) => {
  const { isLoading, isError, dailyAppointmentsNum, patients } = props;
  const { formatMessage: f } = useIntl();
  const nav = useNavigate();

  return (
    <FeatureWidget
      title={f({ id: "alerts" })}
      icon={faExclamationCircle}
      color="var(--warn-text)"
      className="alerts-widget"
    >
      <div className="alerts-list">
        {isLoading && (
          <div className="alert-item loading">
            <div className="alert-loading"></div>
            <span>{f({ id: "loading" })}</span>
          </div>
        )}
        {isError && (
          <div className="alert-item error">
            <div className="alert-icon">⚠️</div>
            <span>{f({ id: "errorLoadingData" })}</span>
          </div>
        )}
        {dailyAppointmentsNum > 5 && (
          <div
            className="alert-item warning clickable"
            onClick={() => nav(AppRoutes.APPOINTMENT_CALENDER)}
          >
            <div className="alert-icon">📅</div>
            <span>
              {dailyAppointmentsNum} {f({ id: "appointmentsToday" })}
            </span>
          </div>
        )}
        {patients && patients.length > 10 && (
          <div className="alert-item info">
            <div className="alert-icon">🆕</div>
            <span>
              {patients.length} {f({ id: "newPatientsToday" })}
            </span>
          </div>
        )}
      </div>
    </FeatureWidget>
  );
};
