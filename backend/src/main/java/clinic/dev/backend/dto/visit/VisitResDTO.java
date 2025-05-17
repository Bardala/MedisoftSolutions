package clinic.dev.backend.dto.visit;

import java.time.LocalDateTime;

import clinic.dev.backend.model.Visit;

public record VisitResDTO(
    Long id,
    Long patientId,
    Long clinicId,
    Long doctorId,
    Long assistantId,
    Integer waitTime,
    Integer duration,
    String doctorNotes,
    LocalDateTime createdAt) {

  public static VisitResDTO fromEntity(Visit visit) {
    return new VisitResDTO(
        visit.getId(),
        visit.getPatient().getId(),
        visit.getClinic().getId(),
        visit.getDoctor().getId(),
        visit.getAssistant() != null ? visit.getAssistant().getId() : null,
        visit.getWait(),
        visit.getDuration(),
        visit.getDoctorNotes(),
        visit.getCreatedAt());
  }
}