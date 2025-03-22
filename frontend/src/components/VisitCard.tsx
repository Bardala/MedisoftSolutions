import React, { FC, useState, useEffect } from "react";
import { useLogin } from "../context/loginContext";
import { useUpdateVisit } from "../hooks/useVisit";
import {
  useDeleteVisitProcedure,
  useGetVisitProceduresByVisitId,
  useRecordVisitsProcedures,
} from "../hooks/useVisitDentalProcedure";
import { Visit, VisitDentalProcedure } from "../types";
import { dailyTimeFormate, isArabic, monthlyTimeFormate } from "../utils";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DentalProcedureSearch from "./DentalProcedureSearch";

export const VisitCard: FC<{ visit: Visit; currVisit: boolean }> = ({
  visit,
  currVisit,
}) => {
  const { loggedInUser } = useLogin();
  const [doctorNotes, setDoctorNotes] = useState("");
  const { updateVisitMutation } = useUpdateVisit();
  const { query: currVisitProcedures } = useGetVisitProceduresByVisitId(
    visit?.id,
  );
  const currVps = currVisitProcedures.data as VisitDentalProcedure[];
  const { deleteMutation: deleteVpMutation } = useDeleteVisitProcedure();
  const {
    handleDentalProcedureSelect,
    selectedDentalProcedures,
    handleRecordVisitProcedures,
    setSelectedDentalProcedures,
  } = useRecordVisitsProcedures();

  useEffect(() => {
    if (visit) setDoctorNotes(visit.doctorNotes || "");
  }, [visit]);

  const handleSaveNotes = () => {
    if (visit) {
      updateVisitMutation.mutate({ ...visit, doctorNotes });
    }
  };

  const handleDeleteVp = (vp: VisitDentalProcedure) => {
    deleteVpMutation.mutate(vp);
  };

  const handleSubmitAddDp = async () => {
    await handleRecordVisitProcedures(visit.id);
    setSelectedDentalProcedures([]);
  };

  return (
    <div className="visit-details">
      <h3>{currVisit ? "Current Visit Details" : "Last Visit Details"}</h3>
      <p>
        <strong>Visit Id:</strong> {visit.id}
      </p>
      <p>
        <strong>Visit Date:</strong>{" "}
        {currVisit
          ? dailyTimeFormate(visit.createdAt)
          : monthlyTimeFormate(visit.createdAt)}
      </p>
      {/* <p>
        <strong>Duration:</strong>{" "}
        {visit.duration ? `${visit.duration} mins` : "N/A"}
      </p> */}
      <div className="doctor-notes">
        <strong>Doctor Notes:</strong>
        {currVisit && loggedInUser.role === "Doctor" ? (
          <>
            <textarea
              className={isArabic(doctorNotes) ? "arabic" : ""}
              value={doctorNotes}
              onChange={(e) => setDoctorNotes(e.target.value)}
              rows={4}
              placeholder="Add notes here..."
            />
            {doctorNotes !== visit.doctorNotes && (
              <div className="notes-buttons">
                <button className="save-button" onClick={handleSaveNotes}>
                  Save Notes
                </button>
                <button
                  className="cancel-button"
                  onClick={() => setDoctorNotes(visit.doctorNotes || "")}
                >
                  Cancel
                </button>
              </div>
            )}
            {updateVisitMutation.isSuccess && (
              <p>
                New changes "<strong>{doctorNotes}</strong>" have been saved
              </p>
            )}
          </>
        ) : (
          <p>{doctorNotes || "N/A"}</p>
        )}
      </div>

      {currVps?.length > 0 && (
        <div className="selected-items">
          Dental Procedures:
          <ul>
            {currVps.map((vp) => (
              <li key={vp.id}>
                {vp.dentalProcedure.serviceName} (
                {vp.dentalProcedure.arabicName})
                {currVisit && loggedInUser.role === "Doctor" && (
                  <button
                    className="action-button danger"
                    onClick={() => handleDeleteVp(vp)}
                    title="Remove"
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {currVisit && loggedInUser.role === "Doctor" && (
        <div>
          <DentalProcedureSearch onSelect={handleDentalProcedureSelect} />
          {selectedDentalProcedures.length > 0 && (
            <div className="selected-items">
              Selected Dental Procedures:
              <ul>
                {selectedDentalProcedures.map((dp) => (
                  <li key={dp.id}>
                    {dp.serviceName} ({dp.arabicName})
                  </li>
                ))}
              </ul>
              {selectedDentalProcedures.length > 0 && (
                <>
                  <button onClick={handleSubmitAddDp} title="Submit">
                    Add
                  </button>
                  <button onClick={() => setSelectedDentalProcedures([])}>
                    Cancel
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
