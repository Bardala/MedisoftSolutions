import { useLogin } from "@/app";
import { MedicineTable } from "@/features/medicines";
import { DentalProcedureSearch } from "@/features/procedures";
import { VisitAnalysis, isDoctorRole } from "@/shared";
import { dateFormate, dailyTimeFormate, isArabic } from "@/utils";
import {
  faChevronUp,
  faChevronDown,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, useState, useEffect } from "react";
import { useIntl } from "react-intl";
import {
  useUpdateVisit,
  useGetVisitProceduresByVisitId,
  useDeleteVisitProcedure,
} from "../hooks";
import "@styles/visitCard.css";

const VisitCard: FC<{
  analyzedVisit: VisitAnalysis;
  currVisit: boolean;
}> = ({ analyzedVisit, currVisit }) => {
  const { formatMessage: f } = useIntl();
  const { loggedInUser } = useLogin();
  const [doctorNotes, setDoctorNotes] = useState("");
  const { updateVisitMutation } = useUpdateVisit();
  const { query: currVisitProcedures } = useGetVisitProceduresByVisitId(
    analyzedVisit.visit.id,
  );
  const visit = analyzedVisit.visit;
  const currVps = currVisitProcedures.data;
  const { deleteMutation: deleteVpMutation } = useDeleteVisitProcedure();
  const [showVisit, setShowVisit] = useState(currVisit); // Auto-expand current visit

  useEffect(() => {
    if (visit) setDoctorNotes(visit.doctorNotes || "");
  }, [visit]);

  const handleSaveNotes = () => {
    if (visit)
      updateVisitMutation.mutate({
        ...visit,
        doctorNotes,
        patientId: visit.patientId,
        doctorId: visit.doctorId,
      });
  };

  const handleDeleteVp = (vpId: number) => {
    if (window.confirm(f({ id: "confirm_delete_procedure" }))) {
      deleteVpMutation.mutate(vpId);
    }
  };

  const isDoctor = isDoctorRole(loggedInUser.role);
  const isDoctorAndCurrVisit = currVisit && isDoctor;

  return (
    <div className={`visit-card ${currVisit ? "current-visit" : ""}`}>
      <div
        className="visit-card-header"
        onClick={() => !currVisit && setShowVisit(!showVisit)}
      >
        <h3 className="visit-card-title">
          {currVisit
            ? f({ id: "currentVisitDetails" })
            : f({ id: "lastVisitDetails" })}
        </h3>
        {!currVisit && (
          <FontAwesomeIcon
            icon={showVisit ? faChevronUp : faChevronDown}
            className="toggle-icon"
          />
        )}
      </div>

      {showVisit && (
        <div className="visit-card-content">
          <div className="info-grid">
            <div className="info-card">
              <div className="card-icon">😷</div>
              <h4 className="card-title">{f({ id: "visitReason" })}</h4>
              <p className="card-content">{visit?.reason || "-"}</p>
            </div>

            {!currVisit && (
              <div className="info-card">
                <div className="card-icon">📅</div>
                <h4 className="card-title">{f({ id: "visitDate" })}</h4>
                <p className="card-content">{dateFormate(visit.createdAt)}</p>
              </div>
            )}

            <div className="info-card">
              <div className="card-icon">🕒</div>
              <h4 className="card-title">{f({ id: "arrived_at" })}</h4>
              <p className="card-content">
                {dailyTimeFormate(visit.createdAt)}
              </p>
            </div>
          </div>

          {/* Doctor Notes Section */}
          <div className="notes-section">
            <h4 className="section-title">
              <span className="icon">📝</span>
              {f({ id: "doctorNotes" })}
            </h4>
            {isDoctorAndCurrVisit ? (
              <>
                <textarea
                  className={`notes-textarea ${
                    isArabic(doctorNotes) ? "arabic" : ""
                  }`}
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  rows={4}
                  placeholder={f({ id: "addNotesPlaceholder" })}
                />
                {doctorNotes !== visit.doctorNotes && (
                  <div className="notes-buttons">
                    <button
                      className="save-button"
                      onClick={handleSaveNotes}
                      disabled={updateVisitMutation.isLoading}
                    >
                      {updateVisitMutation.isLoading
                        ? f({ id: "saving" })
                        : f({ id: "saveNotes" })}
                    </button>
                    <button
                      className="cancel-button"
                      onClick={() => setDoctorNotes(visit.doctorNotes || "")}
                      disabled={updateVisitMutation.isLoading}
                    >
                      {f({ id: "cancel" })}
                    </button>
                  </div>
                )}
                {updateVisitMutation.isSuccess && (
                  <div className="status-message success">
                    {f({ id: "notesSaved" })}
                  </div>
                )}
                {updateVisitMutation.isError && (
                  <div className="status-message error">
                    {f({ id: "error_saving_notes" })}
                  </div>
                )}
              </>
            ) : (
              <p className="notes-content">
                {doctorNotes || f({ id: "not_available" })}
              </p>
            )}
          </div>

          {/* Procedures List */}
          {currVps?.length > 0 && (
            <div className="procedures-section">
              <h4 className="section-title">
                <span className="icon">🦷</span>
                {f({ id: "procedures" })}
              </h4>
              <ul className="procedures-list">
                {currVps.map((vp) => (
                  <li key={vp.id} className="procedure-item">
                    <div className="procedure-info">
                      <span className="procedure-name">{vp.procedureName}</span>
                      <span className="procedure-arabic">
                        {vp.procedureArabicName}
                      </span>
                    </div>
                    {isDoctorAndCurrVisit && (
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteVp(vp.id)}
                        title={f({ id: "remove" })}
                        disabled={deleteVpMutation.isLoading}
                      >
                        <FontAwesomeIcon
                          icon={faTrashAlt}
                          className={
                            deleteVpMutation.isLoading ? "spinning" : ""
                          }
                        />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Additional Components */}
          {isDoctorAndCurrVisit && (
            <div className="search-section">
              <DentalProcedureSearch visit={visit} />
            </div>
          )}

          {isDoctor && (
            <div className="medicine-section">
              <MedicineTable visit={visit} enableEditing={currVisit} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VisitCard;
