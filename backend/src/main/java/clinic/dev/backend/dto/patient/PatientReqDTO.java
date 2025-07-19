package clinic.dev.backend.dto.patient;

import clinic.dev.backend.model.Clinic;
import clinic.dev.backend.model.Patient;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record PatientReqDTO(
    @NotBlank(message = "Full name is required") String fullName,
    @NotBlank(message = "Phone number is required") @Pattern(regexp = "^0\\d{9,14}$", message = "Phone must start with 0 and be 10-15 digits") String phone,
    String medicalHistory,
    Integer age,
    String address,
    String notes) {

  public Patient toEntity(Clinic clinic) {
    return new Patient(
        null,
        clinic,
        fullName,
        age,
        notes,
        phone,
        address,
        medicalHistory,
        null);
  }

  public void updateEntity(Patient patient, Clinic clinic) {
    patient.setFullName(fullName);
    patient.setPhone(phone);
    patient.setAge(age);
    patient.setAddress(address);
    patient.setMedicalHistory(medicalHistory);
    patient.setNotes(notes);
    patient.setClinic(clinic);
  }
}