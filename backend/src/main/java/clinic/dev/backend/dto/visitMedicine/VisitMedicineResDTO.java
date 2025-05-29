package clinic.dev.backend.dto.visitMedicine;

import clinic.dev.backend.model.VisitMedicine;

public record VisitMedicineResDTO(
    Long id,

    Long visitId,
    String patientName,

    Long medicineId,
    String medicineName,
    String medicineDosage,
    String medicineFrequency,
    Integer medicineDuration,
    String medicineInstruction,

    Long clinicId) {

  public static VisitMedicineResDTO fromEntity(VisitMedicine vm) {
    return new VisitMedicineResDTO(
        vm.getId(),

        vm.getVisit().getId(),
        vm.getVisit().getPatient().getFullName(),

        vm.getMedicine().getId(),
        vm.getMedicine().getMedicineName(),
        vm.getMedicine().getDosage(),
        vm.getMedicine().getFrequency(),
        vm.getMedicine().getDuration(),
        vm.getMedicine().getInstructions(),

        vm.getClinic().getId());
  }
}