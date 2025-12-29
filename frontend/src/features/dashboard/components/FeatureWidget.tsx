import { faChartLine, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import "@styles/featuresWidget.css";

// Feature Widget Component
export interface FeatureWidgetProps {
  title: string;
  icon: IconDefinition;
  color: string;
  children: ReactNode;
  route?: string;
  badge?: number;
  className?: string;
}

export const FeatureWidget: FC<FeatureWidgetProps> = ({
  title,
  icon,
  color,
  children,
  route,
  badge,
  className = "",
}) => {
  const navigate = useNavigate();

  return (
    <div
      className={`feature-widget ${className}`}
      style={{ "--widget-color": color } as React.CSSProperties}
    >
      <div
        className={`widget-header  ${route ? "clickable" : ""}`}
        onClick={() => route && navigate(route)}
      >
        <div className="widget-title-section">
          <div
            className="widget-icon"
            style={{ backgroundColor: `${color}20` }}
          >
            <FontAwesomeIcon icon={icon} style={{ color }} />
          </div>
          <h3>{title}</h3>
        </div>
        {badge !== undefined && (
          <div className="widget-badge" style={{ backgroundColor: color }}>
            {badge}
          </div>
        )}
        {route && (
          <div className="widget-action">
            <FontAwesomeIcon icon={faChartLine} />
          </div>
        )}
      </div>
      <div className="widget-body">{children}</div>
    </div>
  );
};
