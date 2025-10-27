// import { useGetPatient } from "@/features/patients";
// import { useGetVisitMedicinesByVisitId } from "@/features/visits";
// import { Table, Visit } from "@/shared";
// import { toothLogo, programLogoImage, whatsappImage } from "@/utils";
// import "@styles/chunk1.css";

// export const Chunk1 = ({ visit }: { visit: Visit }) => {
//   const { query } = useGetVisitMedicinesByVisitId(visit.id);
//   const visitMedicines = query.data || [];
//   const { patientRes: patient } = useGetPatient(visit.patientId);

//   // Split medicines into chunks of 5
//   const chunkArray = (array, size: number) => {
//     const result = [];
//     for (let i = 0; i < array.length; i += size) {
//       result.push(array.slice(i, i + size));
//     }
//     return result;
//   };

//   const medicineChunks = chunkArray(visitMedicines, 5);

//   // Function to handle printing
//   const handlePrint = () => {
//     const printContent = document.getElementById("print-section")?.innerHTML;
//     if (!printContent) return;

//     const styles = Array.from(document.styleSheets)
//       .map((styleSheet) => {
//         try {
//           return Array.from(styleSheet.cssRules)
//             .map((rule) => rule.cssText)
//             .join("\n");
//         } catch (e) {
//           return "";
//         }
//       })
//       .join("\n");

//     const printWindow = window.open("", "", "width=900,height=600");
//     if (printWindow) {
//       printWindow.document.open();
//       printWindow.document.write(`
//       <html>
//         <head>
//           <title>prescription</title>
//           <style>
//             ${styles}
//             @media print {
//               body { margin: 0; padding: 0; }
//               .prescription-chunk {
//                 page-break-after: always;
//                 height: 100vh; /* Full page height */
//                 display: flex;
//                 flex-direction: column;
//                 justify-content: space-between;
//                 font-family: "Cairo", sans-serif;
//                 background-color: #ffffff;
//                 box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
//                 color: #333;
//               }
//               .prescription-chunk:last-child {
//                 page-break-after: avoid;
//               }
//               .clinic-header {
//                 border-bottom: 3px solid #007bff;
//               }
//               .printable-prescription {
//                 flex-grow: 1;
//                 display: flex;
//                 flex-direction: column;
//                 justify-content: space-between;
//                 height 100%;
//               }
//               .prescription-footer {
//                 margin-top: auto; /* Push footer to the bottom */
//               }

//               .prescription-chunk {
//                 height: 100%
//               }
//             }
//           </style>
//         </head>
//         <body onload="window.print(); window.close();">
//           ${printContent}
//         </body>
//       </html>
//     `);
//       printWindow.document.close();
//     }
//   };

//   // Define columns for the printable medicines table
//   const medicineColumns = [
//     {
//       header: "اسم الدواء",
//       accessor: (row) => row.medicine.medicineName + "-" + row.medicine.dosage,
//     },
//     {
//       header: "التعليمات",
//       accessor: (row) => row.medicine.instructions || "-",
//     },
//     {
//       header: "عدد الجرعات",
//       accessor: (row) => row.medicine.frequency || "-",
//     },
//     {
//       header: "المدة (بالأيام)",
//       accessor: (row) => row.medicine.duration || "-",
//     },
//   ];

//   return (
//     <div id="print-section" className="prescription-print-container">
//       {medicineChunks.map((chunk, index) => (
//         <div key={index} className="prescription-chunk">
//           {/* Clinic Header */}
//           <div className="clinic-header">
//             <div className="clinic-logo-container">
//               <img src={toothLogo} alt="Clinic Logo" className="clinic-logo" />
//             </div>

//             <div className="doctor-info">
//               <h1>الدكتور</h1>
//               <h1>محمد سمير الدسوقي</h1>
//               <h2>
//                 <strong>أخصائي طب وجراحة الفم والأسنان </strong>
//               </h2>
//               <h2>
//                 <strong>القصر العيني</strong>
//               </h2>
//             </div>
//           </div>

//           {/* Prescription Content */}
//           <div className="printable-prescription">
//             <h2>الروشتة الطبية</h2>
//             <div className="prescription-header">
//               {patient && (
//                 <>
//                   <p>
//                     <strong>اسم المريض:</strong> {patient.fullName}
//                   </p>
//                   <p>
//                     <strong>العمر: </strong> {patient.age + " سنة" || "N/A"}
//                   </p>
//                 </>
//               )}
//               <p>
//                 <strong>تاريخ الزيارة:</strong>{" "}
//                 {new Date(visit.createdAt).toLocaleDateString("en-GB")}
//               </p>
//             </div>

//             {/* Medicines Table */}
//             {chunk.length > 0 && (
//               // <div className="prescription-table">
//               <Table
//                 columns={medicineColumns}
//                 data={chunk}
//                 enableActions={false}
//               />
//               // </div>
//             )}

//             {/* Footer with signature & logo */}
//             <div className="prescription-footer">
//               <div className="upper-footer">
//                 <div className="signature-section">
//                   <p>
//                     <strong>: توقيع الطبيب</strong>
//                   </p>
//                   <p>________________________</p>
//                 </div>

//                 <div className="company-logo-container">
//                   <img
//                     src={programLogoImage}
//                     alt="MediSoft Logo"
//                     className="company-logo"
//                   />
//                 </div>
//               </div>

//               <div className="lower-footer">
//                 {/* Centered message at bottom */}
//                 <div className="healing-message">
//                   <p>مع تمنياتنا بالشفاء العاجل</p>
//                 </div>

//                 <hr className="clinic-separator" />

//                 {/* Clinic Info */}
//                 <div className="clinic-info">
//                   <p>
//                     <img
//                       src={whatsappImage}
//                       alt="WhatsApp"
//                       className="whatsapp-logo"
//                     />
//                     📞 هاتف: <span>6461-554-0100</span>
//                   </p>
//                   <p>
//                     📍 العنوان: خلف موقف طنطا ، بجوار مسجد عمر بن الخطاب -الباب
//                     الخلفى، كوم حمادة
//                   </p>
//                   <p>
//                     🕒 مواعيد العمل: يوميًا عدا الجمعة من 12 ظهرًا حتى 12 منتصف
//                     الليل
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       ))}

//       {/* Print Button */}
//       <button className="print-button" onClick={handlePrint}>
//         طباعة الروشتة
//       </button>
//     </div>
//   );
// };
