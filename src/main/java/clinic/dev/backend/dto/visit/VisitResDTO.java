package clinic.dev.backend.dto.visit;

import java.time.LocalDateTime;

import clinic.dev.backend.model.Visit;

public record VisitResDTO(
    Long id,

    Long patientId,
    String patientName,
    String patientPhone,

    Long clinicId,

    Long doctorId,
    String doctorName,

    Long assistantId,
    String assistantName,

    Integer waitTime,
    Integer duration,
    String doctorNotes,
    LocalDateTime createdAt) {

  public static VisitResDTO fromEntity(Visit visit) {
    return new VisitResDTO(
        visit.getId(),

        visit.getPatient().getId(),
        visit.getPatient().getFullName(),
        visit.getPatient().getPhone(),

        visit.getClinic().getId(),

        visit.getDoctor().getId(),
        visit.getDoctor().getName(),

        visit.getAssistant() != null ? visit.getAssistant().getId() : null,
        visit.getAssistant() != null ? visit.getAssistant().getName() : null,

        visit.getWait(),
        visit.getDuration(),
        visit.getDoctorNotes(),
        visit.getCreatedAt());
  }
}