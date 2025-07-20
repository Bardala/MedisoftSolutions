package clinic.dev.backend.dto.patient;

import java.time.Instant;

import clinic.dev.backend.model.Patient;

public record PatientResDTO(
    Long id,
    Long clinicId,
    String fullName,
    Integer age,
    String notes,
    String phone,
    String address,
    String medicalHistory,
    Instant createdAt) {
  public static PatientResDTO fromEntity(Patient patient) {
    return new PatientResDTO(
        patient.getId(),
        patient.getClinic().getId(),
        patient.getFullName(),
        patient.getAge(),
        patient.getNotes(),
        patient.getPhone(),
        patient.getAddress(),
        patient.getMedicalHistory(),
        patient.getCreatedAt());
  }
}