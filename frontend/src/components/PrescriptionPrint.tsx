import React, { FC } from "react";
import { Visit, VisitMedicine } from "../types";
import Table from "./Table";
import "../styles/prescriptionPrint.css";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { programLogoImage, whatsappImage } from "../utils/images";
import { useGetVisitMedicinesByVisitId } from "../hooks/useVisitMedicine";

interface PrescriptionPrintProps {
  visit: Visit;
}

export const PrescriptionPrint: FC<PrescriptionPrintProps> = ({ visit }) => {
  const { query } = useGetVisitMedicinesByVisitId(visit.id);
  const visitMedicines: VisitMedicine[] = query.data || [];

  // Split medicines into chunks of 4
  const chunkArray = (array: VisitMedicine[], size: number) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  const medicineChunks = chunkArray(visitMedicines, 4);

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
              body { margin: 0; padding: 20px; }
              .prescription-chunk { 
                page-break-after: always; 
                margin-bottom: 40px;
                
                font-family: "Cairo", sans-serif;
                max-width: 850px;
                margin: 20px auto;
                padding: 20px;
                border-radius: 10px;
                background-color: #ffffff;
                box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
                color: #333;
                height: inherit;
              }
              .prescription-chunk:last-child { 
                page-break-after: avoid;
              }
              .clinic-header {
                border-bottom: 3px solid #007bff;
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
    <div id="print-section" className="prescription-print-container">
      {medicineChunks.map((chunk, index) => (
        <div key={index} className="prescription-chunk">
          {/* Clinic Header */}
          <div className="clinic-header">
            {/* <div className="clinic-logo-container">
              <img
                src={prescriptionLogo}
                alt="Clinic Logo"
                className="clinic-logo"
              />
            </div> */}

            <div className="clinic-info">
              <h1>عيادة الدكتور محمد سمير الدسوقي</h1>
              <h2>أخصائي طب وجراحة الفم والأسنان - القصر العيني</h2>
              <hr className="clinic-separator" />
              {/* <p>📞 هاتف: 01005546461</p> */}
              <p>
                <img
                  src={whatsappImage}
                  alt="WhatsApp"
                  className="whatsapp-logo"
                />
                📞 هاتف: 01005546461
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

          {/* Prescription Content */}
          <div className="printable-prescription">
            <h2>الروشتة الطبية</h2>
            <div className="prescription-header">
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
              <p>
                <strong>Doctor Name:</strong> {visit.doctor.name}
              </p>
            </div>

            {/* Medicines Table */}
            {chunk.length > 0 && (
              <Table
                columns={medicineColumns}
                data={chunk}
                enableActions={false}
              />
            )}

            {/* Footer with signature & logo */}
            <div className="prescription-footer">
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

            {/* Centered message at bottom */}
            <div className="healing-message">
              <p>مع تمنياتنا بالشفاء العاجل</p>
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
