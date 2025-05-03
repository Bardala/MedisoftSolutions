import React, { useState } from "react";
import "../styles/dentalChart.css";
import { canine, incisor, molar, premolars, wisdomTeeth } from "../utils";

type ToothCondition = "healthy" | "cavity" | "crown" | "extracted" | "filled";
type ToothData = Record<string, ToothCondition>;

const toothTypeMap: Record<number, { type: string; image: string }> = {
  18: { type: "wisdom", image: wisdomTeeth },
  17: { type: "molar", image: molar },
  16: { type: "molar", image: molar },
  15: { type: "premolar", image: premolars },
  14: { type: "premolar", image: premolars },
  13: { type: "canine", image: canine },
  12: { type: "incisor", image: incisor },
  11: { type: "incisor", image: incisor },
  21: { type: "incisor", image: incisor },
  22: { type: "incisor", image: incisor },
  23: { type: "canine", image: canine },
  24: { type: "premolar", image: premolars },
  25: { type: "premolar", image: premolars },
  26: { type: "molar", image: molar },
  27: { type: "molar", image: molar },
  28: { type: "wisdom", image: wisdomTeeth },
  38: { type: "wisdom", image: wisdomTeeth },
  37: { type: "molar", image: molar },
  36: { type: "molar", image: molar },
  35: { type: "premolar", image: premolars },
  34: { type: "premolar", image: premolars },
  33: { type: "canine", image: canine },
  32: { type: "incisor", image: incisor },
  31: { type: "incisor", image: incisor },
  41: { type: "incisor", image: incisor },
  42: { type: "incisor", image: incisor },
  43: { type: "canine", image: canine },
  44: { type: "premolar", image: premolars },
  45: { type: "premolar", image: premolars },
  46: { type: "molar", image: molar },
  47: { type: "molar", image: molar },
  48: { type: "wisdom", image: wisdomTeeth },
};

const DentalChart: React.FC = () => {
  const [teeth, setTeeth] = useState<ToothData>({});
  const [selectedCondition, setSelectedCondition] =
    useState<ToothCondition>("cavity");

  // Organized by quadrants for better positioning
  const upperRight = [18, 17, 16, 15, 14, 13, 12, 11];
  const upperLeft = [21, 22, 23, 24, 25, 26, 27, 28];
  const lowerLeft = [38, 37, 36, 35, 34, 33, 32, 31];
  const lowerRight = [41, 42, 43, 44, 45, 46, 47, 48];

  const handleToothClick = (toothId: number) => {
    setTeeth((prev) => ({
      ...prev,
      [toothId]:
        prev[toothId] === selectedCondition ? "healthy" : selectedCondition,
    }));
  };

  const getToothStyle = (condition: ToothCondition) => {
    switch (condition) {
      case "cavity":
        return {
          filter: "drop-shadow(0 0 4px rgba(220, 53, 69, 0.7))",
          opacity: 0.9,
        };
      case "crown":
        return {
          filter: "drop-shadow(0 0 4px rgba(255, 193, 7, 0.7))",
          opacity: 0.95,
        };
      case "extracted":
        return { opacity: 0.2, filter: "grayscale(100%)" };
      case "filled":
        return {
          filter: "drop-shadow(0 0 4px rgba(40, 167, 69, 0.7))",
          opacity: 0.95,
        };
      default:
        return { opacity: 1 };
    }
  };

  const renderTooth = (
    toothId: number,
    position: { x: number; y: number },
    isUpper: boolean,
    width = 50, // Increased from 30
    height = 65, // Increased from 40
  ) => {
    const toothType = toothTypeMap[toothId];
    if (!toothType) return null;

    const condition = teeth[toothId] || "healthy";
    const style = getToothStyle(condition);

    const imageTransform = isUpper
      ? `rotate(180 ${width / 2} ${height / 2})`
      : undefined;

    const conditionColorMap: Record<ToothCondition, string> = {
      healthy: "transparent",
      cavity: "#dc3545",
      crown: "#ffc107",
      extracted: "#6c757d",
      filled: "#28a745",
    };

    return (
      <g
        key={`tooth-${toothId}`}
        transform={`translate(${position.x}, ${position.y})`}
        className="tooth-group"
      >
        {/* Background highlight when selected */}
        {condition !== "healthy" && (
          <rect
            x="0"
            y="0"
            width={width}
            height={height}
            rx="8"
            fill={conditionColorMap[condition]}
            opacity="0.2"
          />
        )}

        <image
          href={toothType.image}
          width={width}
          height={height}
          transform={imageTransform}
          style={{
            ...style,
            cursor: "pointer",
          }}
          onClick={() => handleToothClick(toothId)}
        />

        {/* Tooth number */}
        {/* <text
          x={width / 2}
          y={isUpper ? height + 18 : -12} // Adjusted for larger teeth
          textAnchor="middle"
          fontSize="14" // Slightly larger font
          fill="#2c3e50"
          fontWeight="600"
        >
          {toothId}
        </text> */}

        {/* Condition indicator */}
        {condition !== "healthy" && (
          <circle
            cx={width - 12} // Adjusted position
            cy={12}
            r="6" // Slightly larger
            fill={conditionColorMap[condition]}
            stroke="#fff"
            strokeWidth="2"
          />
        )}
      </g>
    );
  };

  // Curved jaw positioning with larger spacing
  // const getCurvedPosition = (index: number, total: number, radius: number) => {
  //   const angle = Math.PI * 0.8 * (index / (total - 1)) - Math.PI * 0.4;
  //   // return { x: 90, y: 90 };
  //   return {
  //     x: radius * Math.sin(angle) + radius,
  //     y: radius * Math.cos(angle) * 0.35, // Adjusted curve
  //   };
  // };

  const getCurvedPosition = (index: number, total: number, radius: number) => {
    const centerIndex = (total - 1) / 2;
    const distanceFromCenter = Math.abs(index - centerIndex);

    // Modify this exponent to control spacing spread
    const spreadFactor = Math.pow(distanceFromCenter / centerIndex, 1.8);

    // Define the angular range (e.g. ±0.4 * π)
    const baseAngle = Math.PI * 0.4;
    const angleOffset = (index - centerIndex) / centerIndex;

    // Apply spread
    const angle = baseAngle * angleOffset * (1 + spreadFactor * 0.5);

    return {
      x: radius * Math.sin(angle) + radius,
      y: radius * Math.cos(angle) * 0.35,
    };
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getLinearPosition = (index: number, spacing = 60) => {
    return {
      x: index * spacing,
      y: 0,
    };
  };

  return (
    <div className="dental-chart">
      <header className="chart-header">
        <h2>Dental Chart Visualization</h2>
        <p className="subtitle">Click on teeth to mark procedures</p>
      </header>

      <div className="controls-container">
        <div className="controls">
          <label>
            <span className="control-label">Select Procedure:</span>
            <select
              value={selectedCondition}
              onChange={(e) =>
                setSelectedCondition(e.target.value as ToothCondition)
              }
            >
              <option value="cavity">Cavity</option>
              <option value="crown">Crown</option>
              <option value="extracted">Extracted</option>
              <option value="filled">Filled</option>
              <option value="healthy">Healthy</option>
            </select>
          </label>
        </div>

        <div className="legend">
          <div className="legend-item cavity">Cavity</div>
          <div className="legend-item crown">Crown</div>
          <div className="legend-item extracted">Extracted</div>
          <div className="legend-item filled">Filled</div>
        </div>
      </div>

      <div className="jaw-diagram">
        <svg
          width="100%"
          height="600" // Increased height
          viewBox="0 0 900 600" // Larger viewBox
          className="jaw-container"
        >
          {/* Upper Jaw */}
          <g transform="translate(20, 100)" className="upper-jaw">
            {/* <path
              d="M100,0 Q450,30 800,0"
              stroke="#e0e0e0"
              fill="none"
              strokeWidth="2"
            /> */}
            {[...upperRight, ...upperLeft].map((tooth, index) =>
              // renderTooth(tooth, getLinearPosition(index), true),
              renderTooth(tooth, getCurvedPosition(index, 16, 350), true),
            )}
          </g>

          {/* Lower Jaw */}
          <g transform="translate(20, 300)" className="lower-jaw">
            {/* <path
              d="M100,0 Q450,-30 800,0"
              stroke="#e0e0e0"
              fill="none"
              strokeWidth="2"
            /> */}
            {[...lowerLeft, ...lowerRight].map((tooth, index) =>
              // renderTooth(tooth, getLinearPosition(index), false),
              renderTooth(tooth, getCurvedPosition(index, 16, 350), false),
            )}
          </g>
        </svg>
      </div>

      <div className="selected-procedures">
        <h3>Current Procedures</h3>
        {Object.keys(teeth).filter((id) => teeth[id] !== "healthy").length >
        0 ? (
          <div className="procedures-grid">
            {Object.entries(teeth).map(
              ([toothId, condition]) =>
                condition !== "healthy" && (
                  <div key={toothId} className={`procedure-card ${condition}`}>
                    <span className="tooth-id">Tooth {toothId}</span>
                    <span className="procedure-type">{condition}</span>
                  </div>
                ),
            )}
          </div>
        ) : (
          <p className="no-procedures">No procedures marked yet</p>
        )}
      </div>
    </div>
  );
};

export default DentalChart;
