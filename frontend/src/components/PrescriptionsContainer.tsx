import { FC, useState, useEffect } from "react";
import { PrescriptionPrint } from "./PrescriptionPrint";
import { PrescriptionPrint2 } from "./PrescriptionPrint2";
import { PrescriptionPrint3 } from "./PrescriptionPrint3"; // Import the new design
import { Visit } from "../types";
import "../styles/prescriptionsContainer.css";

interface PrescriptionsContainerProps {
  visit: Visit;
}

export const PrescriptionsContainer: FC<PrescriptionsContainerProps> = ({
  visit,
}) => {
  // Retrieve the saved design choice from localStorage, or default to "design1"
  const [selectedDesign, setSelectedDesign] = useState<
    "design1" | "design2" | "design3"
  >(() => {
    const savedDesign = localStorage.getItem("prescriptionDesign");
    return (savedDesign as "design1" | "design2" | "design3") || "design1";
  });

  // Save the selected design to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("prescriptionDesign", selectedDesign);
  }, [selectedDesign]);

  return (
    <div className="prescriptions-container">
      {/* Design Selection Dropdown */}
      <div className="design-selector">
        <label htmlFor="design-select">Choose Prescription Design: </label>
        <select
          id="design-select"
          value={selectedDesign}
          onChange={(e) =>
            setSelectedDesign(
              e.target.value as "design1" | "design2" | "design3",
            )
          }
        >
          <option value="design1">New Design</option>
          <option value="design2">New Design A5</option>
          <option value="design3">Old Design</option> {/* Add new option */}
        </select>
      </div>

      {/* Render Selected Design */}
      <div className="prescription-design">
        {selectedDesign === "design1" && <PrescriptionPrint visit={visit} />}
        {selectedDesign === "design2" && <PrescriptionPrint2 visit={visit} />}
        {selectedDesign === "design3" && (
          <PrescriptionPrint3 visit={visit} />
        )}{" "}
        {/* Add new design */}
      </div>
    </div>
  );
};
