import { Dispatch, SetStateAction, FC } from "react";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faChartColumn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useIntl } from "react-intl";
import "../styles/toggleStatsData.css";

interface ToggleStatsDataProps {
  header: string;
  setShowStats: Dispatch<SetStateAction<boolean>>;
  showStats: boolean;
  dataIcon: IconDefinition;
}

export const ToggleStatsData: FC<ToggleStatsDataProps> = ({
  header,
  setShowStats,
  showStats,
  dataIcon,
}) => {
  const { formatMessage: f } = useIntl();

  return (
    <div className="report-header">
      <button
        className="toggle-view-button"
        onClick={() => setShowStats(!showStats)}
        title={showStats ? f({ id: "view_table" }) : f({ id: "view_charts" })}
      >
        <FontAwesomeIcon icon={showStats ? faChartColumn : dataIcon} />
      </button>
      <h2>{header}</h2>
    </div>
  );
};
