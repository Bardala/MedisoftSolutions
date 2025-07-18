package clinic.dev.backend.dto.medicine;

import java.time.LocalDateTime;

import clinic.dev.backend.model.Medicine;

public record MedicineResDTO(
    Long id,
    Long clinicId,
    String medicineName,
    String dosage,
    String frequency,
    Integer duration,
    String instructions,
    LocalDateTime createdAt) {
  public static MedicineResDTO fromEntity(Medicine medicine) {
    return new MedicineResDTO(
        medicine.getId(),
        medicine.getClinic().getId(),
        medicine.getMedicineName(),
        medicine.getDosage(),
        medicine.getFrequency(),
        medicine.getDuration(),
        medicine.getInstructions(),
        medicine.getCreatedAt());
  }
}