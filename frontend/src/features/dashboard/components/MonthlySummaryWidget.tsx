import { useMonthlySummary } from "@/features/reports";
import {
  faChartLine,
  faUserPlus,
  faHospital,
  faDollarSign,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC } from "react";
import { useIntl } from "react-intl";
import { FeatureWidget } from "./FeatureWidget";
import "@styles/monthlySummaryWidget.css";
import { AppRoutes } from "@/app/constants";
import { useLogin } from "@/app";
import { isOwnerRole } from "@/shared";

export const MonthlySummaryWidget: FC = () => {
  const { loggedInUser: user } = useLogin();
  const { formatMessage: f } = useIntl();
  const { data, isLoading, isError } = useMonthlySummary();

  if (isLoading)
    return (
      <FeatureWidget
        title={f({ id: "monthly_summary" })}
        icon={faChartLine}
        color="var(--success-text)"
        className="stats-widget monthly-summary-widget"
        route={AppRoutes.MONTHLY_REPORTS}
      >
        <div>Loading...</div>
      </FeatureWidget>
    );
  if (isError)
    return (
      <FeatureWidget
        title={f({ id: "monthly_summary" })}
        icon={faChartLine}
        color="var(--success-text)"
        className="stats-widget monthly-summary-widget"
        route={AppRoutes.MONTHLY_REPORTS}
      >
        <div className="error">
          <span>{f({ id: "errorLoadingData" })}</span>
        </div>
      </FeatureWidget>
    );

  const { totalNewPatients, totalRevenue, totalVisits } = data;

  return (
    <FeatureWidget
      title={f({ id: "monthly_summary" })}
      icon={faChartLine}
      color="var(--success-text)"
      className="stats-widget monthly-summary-widget"
      route={AppRoutes.MONTHLY_REPORTS}
    >
      <div className="quick-stats-grid">
        {isOwnerRole(user.role) && (
          <>
            <div className="quick-stat">
              <div className="stat-icon">
                <FontAwesomeIcon icon={faUserPlus} />
              </div>
              <div className="stat-info">
                <span className="stat-value">+{totalNewPatients}</span>
                <span className="stat-label">{f({ id: "new_patients" })}</span>
              </div>
            </div>
            <div className="quick-stat">
              <div className="stat-icon">
                <FontAwesomeIcon icon={faDollarSign} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{totalRevenue}</span>
                <span className="stat-label">{f({ id: "L.E" })}</span>
              </div>
            </div>
          </>
        )}
        <div className="quick-stat">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faHospital} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{totalVisits}</span>
            <span className="stat-label">{f({ id: "visits" })}</span>
          </div>
        </div>
      </div>
    </FeatureWidget>
  );
};
