import { FC } from "react";
import { Visit, VisitMedicine } from "../types";
import "../styles/prescriptionPrint.css";
import { useGetVisitMedicinesByVisitId } from "../hooks/useVisitMedicine";
import { prescriptionLogo, programLogoImage, whatsappImage } from "../utils";
import Table from "./Table";
import { useGetClinicSettings } from "../hooks/useClinicSettings";

interface PrescriptionPrintProps {
  visit: Visit;
}

export const PrescriptionPrint: FC<PrescriptionPrintProps> = ({ visit }) => {
  const { query } = useGetVisitMedicinesByVisitId(visit.id);
  const { query: clinicSettingsQuery } = useGetClinicSettings();
  const visitMedicines: VisitMedicine[] = query.data || [];

  const settings = clinicSettingsQuery.data;

  // Split medicines into chunks of 5
  const chunkArray = (array: VisitMedicine[], size: number) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  const medicineChunks = chunkArray(visitMedicines, 5);

  // Function to handle printing
  const handlePrint = () => {
    const printContent = document.getElementById("print-section")?.innerHTML;
    if (!printContent) return;

    const styles = Array.from(document.styleSheets)
      .map((styleSheet) => {
        try {
          return Array.from(styleSheet.cssRules)
            .map((rule) => rule.cssText)
            .join("\n");
        } catch (e) {
          return "";
        }
      })
      .join("\n");

    const printWindow = window.open("", "", "width=900,height=600");
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(`
      <html>
        <head>
          <title>prescription</title>
          <style>
            ${styles}
            @media print {
              body { margin: 0; padding: 0; }
              .prescription-chunk { 
                page-break-after: always; 
                height: 100vh; /* Full page height */
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                font-family: "Cairo", sans-serif;
                background-color: #ffffff;
                box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
                color: #333;
              }
              .prescription-chunk:last-child { 
                page-break-after: avoid;
              }
              .prescription-chunk .clinic-header {
                border-bottom: 3px solid #007bff;
              }
              .prescription-chunk .printable-prescription {
                flex-grow: 1;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                height 100%;
              }
              .prescription-chunk .prescription-footer {
                margin-top: auto; /* Push footer to the bottom */
              }
              table {
                width: 100%;
                border-collapse: collapse;
                border-radius: var(--border-radius);
              }
              .prescription-chunk { 
                height: 100%
              }
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          ${printContent}
        </body>
      </html>
    `);
      printWindow.document.close();
    }
  };

  // Define columns for the printable medicines table
  const medicineColumns = [
    {
      header: "اسم الدواء",
      accessor: (row) =>
        row.medicine.medicineName +
        (row.medicine.dosage && " - " + row.medicine.dosage),
    },
    {
      header: "التعليمات",
      accessor: (row) => row.medicine.instructions || "-",
    },
    {
      header: "عدد الجرعات",
      accessor: (row) => row.medicine.frequency || "-",
    },
    {
      header: "المدة (بالأيام)",
      accessor: (row) => row.medicine.duration || "-",
    },
  ];

  return (
    <div id="print-section" className="prescription-print-container">
      {settings &&
        medicineChunks.map((chunk, index) => (
          <div key={index} className="prescription-chunk">
            {/* Clinic Header */}
            <div className="clinic-header">
              <div className="clinic-logo-container">
                <img
                  src={prescriptionLogo}
                  alt="Clinic Logo"
                  className="clinic-logo"
                />
              </div>

              <div className="doctor-info">
                <h1>الدكتور</h1>
                <h1>{settings.doctorName}</h1>
                <h2>
                  <strong>{settings.doctorTitle}</strong>
                </h2>
                <h2>
                  <strong>{settings.doctorQualification}</strong>
                </h2>
              </div>
            </div>

            {/* Prescription Content */}
            <div className="printable-prescription">
              <div className="prescription-header">
                <p>
                  <strong>اسم المريض:</strong> {visit.patient.fullName}
                </p>
                {visit.patient.age && (
                  <p>
                    <strong>العمر: </strong> {visit.patient.age + " سنة"}
                  </p>
                )}
                <p>
                  <strong>تاريخ الزيارة:</strong>{" "}
                  {new Date(visit.createdAt).toLocaleDateString("en-GB")}
                </p>
              </div>

              {/* Medicines Table */}
              {chunk.length > 0 && (
                <div className="prescription-table">
                  <Table
                    columns={medicineColumns}
                    data={chunk}
                    enableActions={false}
                  />
                </div>
              )}

              {/* Footer */}
              <div className="prescription-footer">
                <div className="upper-footer">
                  <div className="signature-section">
                    <p>
                      <strong>: توقيع الطبيب</strong>
                    </p>
                    <p>________________________</p>
                  </div>

                  <div className="company-logo-container">
                    <img
                      src={programLogoImage}
                      alt="MediSoft Logo"
                      className="company-logo"
                    />
                  </div>
                </div>

                <div className="lower-footer">
                  {/* Healing Message */}
                  <div className="healing-message">
                    <p>{settings.healingMessage}</p>
                  </div>

                  <hr className="clinic-separator" />

                  {/* Clinic Info */}
                  <div className="clinic-info">
                    <p>
                      <img
                        src={whatsappImage}
                        alt="WhatsApp"
                        className="whatsapp-logo"
                      />
                      📞 هاتف: <span>{settings.clinicPhoneNumber}</span>
                    </p>
                    <p>{settings.clinicAddress}</p>
                    <p>{settings.workingHours}</p>
                  </div>

                  {/* Optional Print Footer Notes */}
                  {settings.printFooterNotes && (
                    <p className="footer-notes">{settings.printFooterNotes}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

      {/* Print Button */}
      <button className="print-button" onClick={handlePrint}>
        طباعة الروشتة
      </button>
    </div>
  );
};
