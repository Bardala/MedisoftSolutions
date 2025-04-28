import React, { FC, useState, useEffect } from "react";
import { useLogin } from "../context/loginContext";
import { useUpdateVisit } from "../hooks/useVisit";
import {
  useDeleteVisitProcedure,
  useGetVisitProceduresByVisitId,
  useRecordVisitsProcedures,
} from "../hooks/useVisitDentalProcedure";
import { VisitAnalysis, VisitDentalProcedure } from "../types";
import { dailyTimeFormate, isArabic, monthlyTimeFormate } from "../utils";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DentalProcedureSearch from "./DentalProcedureSearch";
import { useIntl } from "react-intl";
import { MedicineTable } from "./MedicineTable";

export const VisitCard: FC<{
  analyzedVisit: VisitAnalysis;
  currVisit: boolean;
}> = ({ analyzedVisit, currVisit }) => {
  const { formatMessage: f } = useIntl();
  const { loggedInUser } = useLogin();
  const [doctorNotes, setDoctorNotes] = useState("");
  const { updateVisitMutation } = useUpdateVisit();
  const { query: currVisitProcedures } = useGetVisitProceduresByVisitId(
    analyzedVisit?.visit?.id,
  );
  const visit = analyzedVisit.visit;
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
      <h2>
        {currVisit
          ? f({ id: "currentVisitDetails" })
          : f({ id: "lastVisitDetails" })}
      </h2>
      <p>
        <strong>🆔 {f({ id: "visitId" })}:</strong> {visit.id}
      </p>
      <p>
        <strong> 📅 {f({ id: "visitDate" })}:</strong>{" "}
        {currVisit
          ? dailyTimeFormate(visit.createdAt)
          : monthlyTimeFormate(visit.createdAt)}
      </p>
      <div className="doctor-notes">
        <strong>📝 {f({ id: "doctorNotes" })}:</strong>
        {currVisit && loggedInUser.role === "Doctor" ? (
          <>
            <textarea
              className={isArabic(doctorNotes) ? "arabic" : ""}
              value={doctorNotes}
              onChange={(e) => setDoctorNotes(e.target.value)}
              rows={4}
              placeholder={f({ id: "addNotesPlaceholder" })}
            />
            {doctorNotes !== visit.doctorNotes && (
              <div className="notes-buttons">
                <button className="save-button" onClick={handleSaveNotes}>
                  {f({ id: "saveNotes" })}
                </button>
                <button
                  className="cancel-button"
                  onClick={() => setDoctorNotes(visit.doctorNotes || "")}
                >
                  {f({ id: "cancel" })}
                </button>
              </div>
            )}
            {updateVisitMutation.isSuccess && (
              <p>
                {f(
                  { id: "notesSaved" },
                  { notes: <strong>{doctorNotes}</strong> },
                )}
              </p>
            )}
          </>
        ) : (
          <p>{doctorNotes || f({ id: "not_available" })}</p>
        )}
      </div>

      {currVps?.length > 0 && (
        <div className="selected-items">
          {f({ id: "procedures" })}:
          <ul>
            {currVps.map((vp) => (
              <li key={vp.id}>
                {vp.dentalProcedure.serviceName} (
                {vp.dentalProcedure.arabicName})
                {currVisit && loggedInUser.role === "Doctor" && (
                  <button
                    className="action-button danger"
                    onClick={() => handleDeleteVp(vp)}
                    title={f({ id: "remove" })}
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
              {f({ id: "selectedDentalProcedures" })}:
              <ul>
                {selectedDentalProcedures.map((dp) => (
                  <li key={dp.id}>
                    {dp.serviceName} ({dp.arabicName})
                  </li>
                ))}
              </ul>
              {selectedDentalProcedures.length > 0 && (
                <>
                  <button onClick={handleSubmitAddDp} title={f({ id: "add" })}>
                    {f({ id: "add" })}
                  </button>
                  <button onClick={() => setSelectedDentalProcedures([])}>
                    {f({ id: "cancel" })}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {loggedInUser.role === "Doctor" && (
        <MedicineTable visit={visit} enableEditing={currVisit ? true : false} />
      )}
    </div>
  );
};

// const procedure = () => {

//   return (
//     <div className="prescription-form">
//         <h3>{f({ id: "createPrescription" })}</h3>
//         <form onSubmit={handleSubmit}>
//           {/* Medicine Search and Selection */}
//           <div className="medicine-search">
//             <input
//               type="text"
//               placeholder={f({ id: "searchMedicine" })}
//               value={medicineName}
//               onChange={(e) => setMedicineName(e.target.value)}
//             />
//             {storedMedicines && (
//               <ul className="search-list visible">
//                 {storedMedicines
//                   .filter((medicine) =>
//                     medicine.medicineName
//                       .toLowerCase()
//                       .includes(medicineName.toLowerCase()),
//                   )
//                   .map((medicine) => (
//                     <li
//                       key={medicine.id}
//                       onClick={() => handleMedicineSelect(medicine)}
//                     >
//                       {medicine.medicineName} - {medicine.dosage}
//                     </li>
//                   ))}
//               </ul>
//             )}
//           </div>
//       </div>
//   );
// }
