import { FC, useState, useEffect } from "react";
import { PrescriptionPrint } from "./PrescriptionPrint";
import { PrescriptionPrint2 } from "./PrescriptionPrint2";
import { PrescriptionPrint3 } from "./PrescriptionPrint3"; // Import the new design
import { Visit } from "../types";
import "../styles/prescriptionsContainer.css";
import { useIntl } from "react-intl";

interface PrescriptionsContainerProps {
  visit: Visit;
}

export const PrescriptionsContainer: FC<PrescriptionsContainerProps> = ({
  visit,
}) => {
  const { formatMessage: f } = useIntl();
  const [selectedDesign, setSelectedDesign] = useState<
    "design1" | "design2" | "design3"
  >(() => {
    const savedDesign = localStorage.getItem("prescriptionDesign");
    return (savedDesign as "design1" | "design2" | "design3") || "design1";
  });

  useEffect(() => {
    localStorage.setItem("prescriptionDesign", selectedDesign);
  }, [selectedDesign]);

  return (
    <div className="prescriptions-container">
      {/* Design Selection Dropdown */}
      <div className="design-selector">
        <label htmlFor="design-select">
          {f({ id: "choosePrescriptionDesign" })}
        </label>
        <select
          id="design-select"
          value={selectedDesign}
          onChange={(e) =>
            setSelectedDesign(
              e.target.value as "design1" | "design2" | "design3",
            )
          }
        >
          <option value="design1">{f({ id: "newDesign" })}</option>
          <option value="design2">{f({ id: "newDesignA5" })}</option>
          <option value="design3">{f({ id: "oldDesign" })}</option>
        </select>
      </div>

      {/* Render Selected Design */}
      <div className="prescription-design">
        {selectedDesign === "design1" && <PrescriptionPrint visit={visit} />}
        {selectedDesign === "design2" && <PrescriptionPrint2 visit={visit} />}
        {selectedDesign === "design3" && <PrescriptionPrint3 visit={visit} />}
      </div>
    </div>
  );
};
