import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import "@styles/statsWidget.css";

interface StatsWidgetProps {
  title: string;
  value: string | number;
  icon: IconDefinition;
  color: string;
  route?: string;
  trend?: string;
}

export const StatsWidget: FC<StatsWidgetProps> = ({
  title,
  value,
  icon,
  color,
  route,
  trend,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className={`stats-widget ${route ? "clickable" : ""}`}
      onClick={() => route && navigate(route)}
      style={{ "--widget-color": color } as React.CSSProperties}
    >
      <div className="widget-header">
        <div className="widget-icon" style={{ backgroundColor: `${color}20` }}>
          <FontAwesomeIcon icon={icon} style={{ color }} />
        </div>
        {trend && <span className="widget-trend">{trend}</span>}
      </div>
      <div className="widget-content">
        <h3 className="widget-value">{value}</h3>
        <p className="widget-title">{title}</p>
      </div>
      {/* {route && (
        <div className="widget-action">
          <FontAwesomeIcon icon={faChartLine} />
        </div>
      )} */}
    </div>
  );
};
