package clinic.dev.backend.dto.visitMedicine;

import clinic.dev.backend.model.VisitMedicine;

public record VisitMedicineResDTO(
    Long id,
    Long visitId,
    Long medicineId,
    String medicineName,
    Long clinicId) {

  public static VisitMedicineResDTO fromEntity(VisitMedicine vm) {
    return new VisitMedicineResDTO(
        vm.getId(),
        vm.getVisit().getId(),
        vm.getMedicine().getId(),
        vm.getMedicine().getMedicineName(),
        vm.getClinic().getId());
  }
}