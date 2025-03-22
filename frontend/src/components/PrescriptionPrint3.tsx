import React, { FC } from "react";
import { Visit, VisitMedicine } from "../types";
import Table from "./Table";
import "../styles/prescriptionPrint3.css"; // New CSS file for this design
import {
  prescriptionLogo,
  programLogoImage,
  whatsappImage,
} from "../utils/images";
import { useGetVisitMedicinesByVisitId } from "../hooks/useVisitMedicine";

interface PrescriptionPrint3Props {
  visit: Visit;
}

export const PrescriptionPrint3: FC<PrescriptionPrint3Props> = ({ visit }) => {
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
    const printContent = document.getElementById("print-section-3")?.innerHTML;
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
              .prescription-chunk3 { 
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
              .prescription-chunk3:last-child { 
                page-break-after: avoid;
              }
              .clinic-header3 {
                border-bottom: 3px solid #007bff;
              }
              .printable-prescription3 {
                flex-grow: 1;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                height 100%;
              }
              .prescription-footer3 {
                margin-top: auto; /* Push footer to the bottom */
              }

              .prescription-chunk3 { 
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
    <div id="print-section-3" className="prescription-print-container3">
      {medicineChunks.map((chunk, index) => (
        <div key={index} className="prescription-chunk3">
          {/* Clinic Header */}
          <div className="clinic-header3">
            <div className="clinic-logo-container3">
              <img
                src={prescriptionLogo}
                alt="Clinic Logo"
                className="clinic-logo3"
              />
            </div>

            <div className="doctor-info3">
              <h1>الدكتور محمد سمير الدسوقي</h1>
              <h2>
                <strong>أخصائي طب وجراحة الفم والأسنان </strong>
              </h2>
              <h2>
                <strong>القصر العيني</strong>
              </h2>
            </div>
          </div>

          {/* Prescription Content */}
          <div className="printable-prescription3">
            {/* <h2>الروشتة الطبية</h2> */}
            <div className="prescription-header3">
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
              <div>
                <Table
                  columns={medicineColumns}
                  data={chunk}
                  enableActions={false}
                />
              </div>
            )}

            {/* Footer with signature & logo */}
            <div className="prescription-footer3">
              <div className="upper-footer3">
                <div className="signature-section3">
                  <p>
                    <strong>: توقيع الطبيب</strong>
                  </p>
                  <p>________________________</p>
                </div>

                <div className="company-logo-container3">
                  <img
                    src={programLogoImage}
                    alt="MediSoft Logo"
                    className="company-logo3"
                  />
                </div>
              </div>

              <div className="lower-footer3">
                {/* Centered message at bottom */}
                <div className="healing-message3">
                  <p>مع تمنياتنا بالشفاء العاجل</p>
                </div>

                <hr className="clinic-separator3" />

                {/* Clinic Info */}
                <div className="clinic-info3">
                  <p>
                    <img
                      src={whatsappImage}
                      alt="WhatsApp"
                      className="whatsapp-logo3"
                    />
                    📞 هاتف: <span>6461-554-0100</span>
                  </p>
                  <p>
                    📍 العنوان: خلف موقف طنطا ، بجوار مسجد عمر بن الخطاب -الباب
                    الخلفى، كوم حمادة
                  </p>
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
      <button className="print-button3" onClick={handlePrint}>
        طباعة الروشتة
      </button>
    </div>
  );
};
