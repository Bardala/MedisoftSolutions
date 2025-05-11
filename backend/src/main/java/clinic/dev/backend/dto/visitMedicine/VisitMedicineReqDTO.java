package clinic.dev.backend.dto.visitMedicine;

import clinic.dev.backend.model.Clinic;
import clinic.dev.backend.model.Medicine;
import clinic.dev.backend.model.Visit;
import clinic.dev.backend.model.VisitMedicine;
import jakarta.validation.constraints.NotNull;

public record VisitMedicineReqDTO(
    @NotNull(message = "Visit ID is required") Long visitId,
    @NotNull(message = "Medicine ID is required") Long medicineId) {

  public VisitMedicine toEntity(Visit visit, Medicine medicine, Clinic clinic) {
    return new VisitMedicine(
        null,
        visit,
        medicine,
        clinic);
  }

  public void updateEntity(VisitMedicine visitMedicine, Visit visit, Medicine medicine, Clinic clinic) {
    visitMedicine.setVisit(visit);
    visitMedicine.setMedicine(medicine);
    visitMedicine.setClinic(clinic);
  }
}
