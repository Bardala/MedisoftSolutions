package clinic.dev.backend.dto.medicine;

import clinic.dev.backend.constants.ErrorMsg;
import clinic.dev.backend.model.Clinic;
import clinic.dev.backend.model.Medicine;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record MedicineReqDTO(
    @NotBlank(message = ErrorMsg.FIELD_MUST_NOT_BE_BLANK) String medicineName,
    @NotBlank(message = ErrorMsg.FIELD_MUST_NOT_BE_BLANK) String dosage,
    @NotBlank(message = ErrorMsg.FIELD_MUST_NOT_BE_BLANK) String frequency,
    @NotNull(message = ErrorMsg.FIELD_MUST_NOT_BE_BLANK) Integer duration,
    String instructions) {

  public Medicine toEntity(Long clinicId) {
    return Medicine.builder()
        .medicineName(medicineName)
        .dosage(dosage)
        .frequency(frequency)
        .duration(duration)
        .instructions(instructions)
        .clinic(new Clinic(clinicId))
        .build();
  }

  public void updateEntity(Medicine medicine) {
    medicine.setMedicineName(medicineName);
    medicine.setDosage(dosage);
    medicine.setDuration(duration);
    medicine.setFrequency(frequency);
    medicine.setInstructions(instructions);
  }
}
