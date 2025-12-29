import { Dispatch, SetStateAction, FC } from "react";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faChartColumn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useIntl } from "react-intl";
import "@styles/toggleStatsData.css";

interface ToggleStatsDataProps {
  header: string;
  setShowStats: Dispatch<SetStateAction<boolean>>;
  showStats: boolean;
  dataIcon: IconDefinition;
}

/**
 * ToggleStatsData Component
   A reusable component that provides a button to toggle between
   statistical chart view and tabular data view in reports.
 * @param {ToggleStatsDataProps} props - The component props
 * @param {string} props.header - The header text to display
 * @param {Dispatch<SetStateAction<boolean>>} props.setShowStats - Function to toggle the stats view
 * @param {boolean} props.showStats - Current state of stats view
 * @param {IconDefinition} props.dataIcon - Icon to represent data table view
 */
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
