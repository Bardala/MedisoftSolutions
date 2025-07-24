import { FC } from "react";
import "../styles/LoadingSpinner.css";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  color?: string;
  withProgress?: boolean;
  progress?: number;
  message?: string;
}

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  size = "medium",
  color = "#007bff",
  withProgress = false,
  progress = 0,
  message = "Loading...",
}) => {
  const sizeMap = {
    small: { spinner: "1rem", container: "1.5rem" },
    medium: { spinner: "2rem", container: "3rem" },
    large: { spinner: "3rem", container: "4.5rem" },
  };

  return (
    <div className="spinner-container">
      <div className="spinner-content">
        <div
          className="loading-spinner"
          style={{
            width: sizeMap[size].spinner,
            height: sizeMap[size].spinner,
            borderColor: `${color} transparent transparent transparent`,
          }}
        />
        {withProgress && (
          <div className="progress-text" style={{ color }}>
            {progress}%
          </div>
        )}
        {message && (
          <div className="loading-message" style={{ color }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};
