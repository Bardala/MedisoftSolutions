import { FC } from "react";
import { Visit, VisitMedicine } from "../types";
import "../styles/prescriptionPrint2.css";
import { useGetVisitMedicinesByVisitId } from "../hooks/useVisitMedicine";
import {
  clinicAddress,
  clinicPhoneNumber,
  doctorName,
  prescriptionLogo,
  programLogoImage,
  whatsappImage,
} from "../utils";
import Table from "./Table";

interface PrescriptionPrint2Props {
  visit: Visit;
}

export const PrescriptionPrint2: FC<PrescriptionPrint2Props> = ({ visit }) => {
  const { query } = useGetVisitMedicinesByVisitId(visit.id);
  const visitMedicines: VisitMedicine[] = query.data || [];

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
    const printContent = document.getElementById("print-section-2")?.innerHTML;
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
              .prescription-chunk2 { 
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
              .prescription-chunk2:last-child { 
                page-break-after: avoid;
              }
              .prescription-chunk2 .clinic-header2 {
                border-bottom: 3px solid #007bff;
              }
              .prescription-chunk2 .printable-prescription2 {
                flex-grow: 1;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                height 100%;
              }
              .prescription-chunk2 .prescription-footer2 {
                margin-top: auto; /* Push footer to the bottom */
              }
              table {
                width: 100%;
                border-collapse: collapse;
                border-radius: var(--border-radius);
              }
              .prescription-chunk2 { 
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
      accessor: (row) => row.medicine.medicineName + "-" + row.medicine.dosage,
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
    <div id="print-section-2" className="prescription-print-container2">
      {medicineChunks.map((chunk, index) => (
        <div key={index} className="prescription-chunk2">
          {/* Clinic Header */}
          <div className="clinic-header2">
            <div className="clinic-logo-container2">
              <img
                src={prescriptionLogo}
                alt="Clinic Logo"
                className="clinic-logo2"
              />
            </div>

            <div className="doctor-info2">
              <h1> الدكتور</h1>
              <h1>{doctorName}</h1>
              <h2>
                <strong>أخصائي طب وجراحة الفم والأسنان </strong>
              </h2>
              <h2>
                <strong>القصر العيني</strong>
              </h2>
            </div>
          </div>

          {/* Prescription Content */}
          <div className="printable-prescription2">
            <div className="prescription-header2">
              <p>
                <strong>اسم المريض:</strong> {visit.patient.fullName}
              </p>
              {visit.patient.age && (
                <p>
                  <strong>العمر: </strong> {visit.patient.age + " سنة" || "N/A"}
                </p>
              )}
              <p>
                <strong>تاريخ الزيارة:</strong>{" "}
                {new Date(visit.createdAt).toLocaleDateString("en-GB")}
              </p>
            </div>

            {/* Medicines Table */}
            {chunk.length > 0 && (
              <div className="prescription-table2">
                <Table
                  columns={medicineColumns}
                  data={chunk}
                  enableActions={false}
                />
              </div>
            )}

            {/* Footer with signature & logo */}
            <div className="prescription-footer2">
              <div className="upper-footer2">
                <div className="signature-section2">
                  <p>
                    <strong>: توقيع الطبيب</strong>
                  </p>
                  <p>________________________</p>
                </div>

                <div className="company-logo-container2">
                  <img
                    src={programLogoImage}
                    alt="MediSoft Logo"
                    className="company-logo2"
                  />
                </div>
              </div>

              <div className="lower-footer2">
                {/* Centered message at bottom */}
                <div className="healing-message2">
                  <p>مع تمنياتنا بالشفاء العاجل</p>
                </div>

                <hr className="clinic-separator2" />

                {/* Clinic Info */}
                <div className="clinic-info2">
                  <p>
                    <img
                      src={whatsappImage}
                      alt="WhatsApp"
                      className="whatsapp-logo2"
                    />
                    📞 هاتف: <span>{clinicPhoneNumber}</span>
                  </p>
                  <p>{clinicAddress}</p>
                  <p>
                    🕒 مواعيد العمل: يوميًا عدا الجمعة من 12 ظهرًا حتى 12 منتصف
                    الليل
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Print Button */}
      <button className="print-button2" onClick={handlePrint}>
        طباعة الروشتة
      </button>
    </div>
  );
};
