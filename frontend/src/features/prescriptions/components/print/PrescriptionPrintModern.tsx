import { FC, useRef } from "react";
import "@styles/prescriptionPrintModern.css";
import { VisitMedicine } from "@/shared";
import { PrescriptionPrintProps } from "./PrescriptionPrint";
import {
  useGetClinicSettings,
  useGetCurrentClinic,
} from "@/features/clinic-management";
import { useGetPatient } from "@/features/patients";
import { useGetVisitMedicinesByVisitId } from "@/features/visits";
import { programLogoImage, whatsappImage } from "@/utils";
import {
  faUser,
  faCalendarAlt,
  faPills,
  faSignature,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useReactToPrint } from "react-to-print";

// todo: update width and height to fit the page size
const PrescriptionPrintModern: FC<PrescriptionPrintProps> = ({
  visit,
  logo,
}) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const { query } = useGetVisitMedicinesByVisitId(visit.id);
  const visitMedicines: VisitMedicine[] = query.data || [];
  const { data: settings } = useGetClinicSettings();
  const { data: clinic } = useGetCurrentClinic();
  const { patientRes: patient } = useGetPatient(visit.patientId);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `
      @page { 
        size: A4; 
        margin: 10mm; 
      }
      @media print {
        body { 
          -webkit-print-color-adjust: exact; 
          print-color-adjust: exact;
          background: white;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .no-print { 
          display: none !important; 
        }
        .modern-prescription-container {
          box-shadow: none;
          padding: 0;
          margin: 0;
        }
        .modern-watermark {
          opacity: 0.08;
        }
      }
    `,
    documentTitle: `Prescription_${patient?.fullName || "Patient"}_${new Date(
      visit.createdAt,
    ).toLocaleDateString("en-GB")}`,
    removeAfterPrint: true,
  });

  return (
    <div className="modern-prescription-wrapper">
      <div ref={componentRef} className="modern-prescription-container">
        {/* Header with Watermark */}
        <div className="modern-header">
          <div className="modern-watermark">PRESCRIPTION</div>
          <div className="modern-clinic-info">
            <img src={logo} alt="Clinic Logo" className="modern-logo" />
            <div className="modern-doctor-info">
              <h2>{settings?.doctorName}</h2>
              <p>{settings?.doctorQualification}</p>
              {settings?.doctorTitle && <p>{settings.doctorTitle}</p>}
            </div>
          </div>
        </div>

        {/* Patient Info Section */}
        <div className="modern-patient-info">
          <div className="modern-patient-card">
            <h3>
              <FontAwesomeIcon icon={faUser} /> Patient Information
            </h3>
            <div className="modern-patient-details">
              <p>
                <strong>Name:</strong> {patient?.fullName}
              </p>
              {patient?.age && (
                <p>
                  <strong>Age:</strong> {patient?.age} years
                </p>
              )}
              <p>
                <FontAwesomeIcon icon={faCalendarAlt} />{" "}
                {new Date(visit.createdAt).toLocaleDateString("en-GB")}
              </p>
            </div>
          </div>
        </div>

        {/* Medicines Section */}
        <div className="modern-medicines-section">
          <h3>
            <FontAwesomeIcon icon={faPills} /> Prescribed Medications
          </h3>
          {visitMedicines.length > 0 ? (
            <div className="modern-medicines-grid">
              {visitMedicines.map((medicine, index) => (
                <div key={index} className="modern-medicine-card">
                  <div className="medicine-name">{medicine.medicineName}</div>
                  <div className="medicine-details">
                    <p>
                      <strong>Dosage:</strong> {medicine.medicineDosage}
                    </p>
                    <p>
                      <strong>Instructions:</strong>{" "}
                      {medicine.medicineInstruction || "As directed"}
                    </p>
                    <p>
                      <strong>Frequency:</strong> {medicine.medicineFrequency}
                    </p>
                    <p>
                      <strong>Duration:</strong> {medicine.medicineDuration}{" "}
                      days
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="modern-no-medicines">No medications prescribed</p>
          )}
        </div>

        {/* Footer Section */}
        <div className="modern-footer">
          <div className="modern-signature">
            <FontAwesomeIcon icon={faSignature} />
            <div className="signature-line"></div>
            <p>Dr. {settings?.doctorName}</p>
          </div>

          <div className="modern-clinic-contact">
            <div className="clinic-credentials">
              <img
                src={programLogoImage}
                alt="Clinic Logo"
                className="clinic-brand-logo"
              />
              {clinic?.phoneSupportsWhatsapp && (
                <img
                  src={whatsappImage}
                  alt="WhatsApp"
                  className="whatsapp-logo"
                />
              )}
              <p>📞 {clinic?.phoneNumber}</p>
            </div>
            <p>{clinic?.address}</p>
            <p className="modern-healing-message">{settings?.healingMessage}</p>
          </div>
        </div>
      </div>

      <button onClick={handlePrint} className="modern-print-button no-print">
        <FontAwesomeIcon icon={faPrint} /> Print Prescription
      </button>
    </div>
  );
};

export default PrescriptionPrintModern;
