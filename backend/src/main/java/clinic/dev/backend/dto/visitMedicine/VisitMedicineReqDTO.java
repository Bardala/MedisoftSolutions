package clinic.dev.backend.dto.visitMedicine;

import clinic.dev.backend.model.Clinic;
import clinic.dev.backend.model.Medicine;
import clinic.dev.backend.model.Visit;
import clinic.dev.backend.model.VisitMedicine;
import jakarta.validation.constraints.NotNull;

public record VisitMedicineReqDTO(
    @NotNull(message = "Visit ID is required") Long visitId,
    @NotNull(message = "Medicine ID is required") Long medicineId) {

  public VisitMedicine toEntity(Long clinicId) {
    return new VisitMedicine(
        null,
        new Visit(visitId),
        new Medicine(medicineId),
        new Clinic(clinicId));
  }

  public void updateEntity(VisitMedicine vm, Long clinicId) {
    vm.setVisit(new Visit(visitId));
    vm.setMedicine(new Medicine(medicineId));
    vm.setClinic(new Clinic(clinicId));
  }
}
