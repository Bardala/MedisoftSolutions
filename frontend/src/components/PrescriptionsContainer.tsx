import { FC, useState, useEffect } from "react";
import { PrescriptionPrint } from "./PrescriptionPrint";
import { PrescriptionPrintA5 } from "./PrescriptionPrint2";
import { PrescriptionPrint3 } from "./PrescriptionPrint3";
import { Visit } from "../types";
import "../styles/prescriptionsContainer.css";
import { useIntl } from "react-intl";
import { PrescriptionPrintModern } from "./PrescriptionPrintModern";

// Available logo options
export const logoOptions = [
  { value: "toothLogo", path: "/dentalLogo4.png", label: "Clinic Logo" },
  // {
  //   value: "logoRedCrossStethoscope",
  //   path: "/logoRedCrossStethoscope.png",
  //   label: "Red Cross Stethoscope",
  // },
  // {
  //   value: "logoGreenRedCrossStethoscope",
  //   path: "/logoGreenRedCrossStethoscope.png",
  //   label: "Green Red Cross Stethoscope",
  // },
  {
    value: "logoHeartStethoscope",
    path: "/logoHeartStethoscope.png",
    label: "Heart Stethoscope",
  },
  {
    value: "strongTooth",
    path: "/strongTooth.png",
    label: "Strong Tooth",
  },
  {
    value: "smileStethoscope",
    path: "/smileStethoscope.png",
    label: "Smile Stethoscope",
  },
];

interface PrescriptionsContainerProps {
  visit: Visit;
}

export const PrescriptionsContainer: FC<PrescriptionsContainerProps> = ({
  visit,
}) => {
  const { formatMessage: f } = useIntl();
  const [selectedDesign, setSelectedDesign] = useState<
    "design1" | "design2" | "design3" | "modern"
  >(() => {
    const savedDesign = localStorage.getItem("prescriptionDesign");
    return (savedDesign as "design1" | "design2" | "design3") || "design1";
  });

  const [selectedLogo, setSelectedLogo] = useState<string>(() => {
    const savedLogo = localStorage.getItem("prescriptionLogo");
    return savedLogo || logoOptions[0].value;
  });

  useEffect(() => {
    localStorage.setItem("prescriptionDesign", selectedDesign);
  }, [selectedDesign]);

  useEffect(() => {
    localStorage.setItem("prescriptionLogo", selectedLogo);
  }, [selectedLogo]);

  // Get the current logo path
  const currentLogo =
    logoOptions.find((logo) => logo.value === selectedLogo)?.path ||
    logoOptions[0].path;

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
              e.target.value as "design1" | "design2" | "design3" | "modern",
            )
          }
        >
          <option value="design1">{f({ id: "newDesign" })}</option>
          <option value="design2">{f({ id: "newDesignA5" })}</option>
          <option value="design3">{f({ id: "oldDesign" })}</option>
          <option value="modern">{f({ id: "modern" })}</option>
        </select>
      </div>

      {/* Logo Selection Dropdown */}
      <div className="logo-selector">
        <label htmlFor="logo-select">{f({ id: "chooseLogoDesign" })}</label>
        <select
          id="logo-select"
          value={selectedLogo}
          onChange={(e) => setSelectedLogo(e.target.value)}
        >
          {logoOptions.map((logo) => (
            <option key={logo.value} value={logo.value}>
              {f({ id: logo.label })}
            </option>
          ))}
        </select>
      </div>

      {/* Render Selected Design with the chosen logo */}
      <div className="prescription-design">
        {selectedDesign === "design1" && (
          <PrescriptionPrint visit={visit} logo={currentLogo} />
        )}
        {selectedDesign === "design2" && (
          <PrescriptionPrintA5 visit={visit} logo={currentLogo} />
        )}
        {selectedDesign === "design3" && (
          <PrescriptionPrint3 visit={visit} logo={currentLogo} />
        )}
        {selectedDesign === "modern" && (
          <PrescriptionPrintModern visit={visit} logo={currentLogo} />
        )}
      </div>
    </div>
  );
};
