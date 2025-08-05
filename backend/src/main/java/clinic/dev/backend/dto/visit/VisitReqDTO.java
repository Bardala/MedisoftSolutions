package clinic.dev.backend.dto.visit;

import java.time.Instant;

import clinic.dev.backend.model.Clinic;
import clinic.dev.backend.model.Patient;
import clinic.dev.backend.model.User;
import clinic.dev.backend.model.Visit;
import jakarta.validation.constraints.NotNull;

public record VisitReqDTO(
    @NotNull(message = "Patient ID is required") Long patientId,
    @NotNull(message = "Doctor ID is required") Long doctorId,
    Long assistantId,
    Integer waitTime,
    Integer duration,
    String doctorNotes,
    Instant scheduledTime,
    String reason) {

  public Visit toEntity(Long clinicId) {
    return Visit.builder()
        .patient(new Patient(patientId))
        .clinic(new Clinic(clinicId))
        .doctor(new User(doctorId))
        .assistant(assistantId == null ? null : new User(assistantId))
        .wait(waitTime)
        .duration(duration)
        .doctorNotes(doctorNotes)
        .scheduledTime(scheduledTime)
        .reason(reason)
        .build();
  }

  public void updateEntity(Visit visit, Long clinicId) {
    visit.setPatient(new Patient(patientId));
    visit.setClinic(new Clinic(clinicId));
    visit.setDoctor(new User(doctorId));
    visit.setAssistant(assistantId == null ? null : new User(assistantId));
    visit.setWait(this.waitTime());
    visit.setDuration(this.duration());
    visit.setDoctorNotes(this.doctorNotes());
    visit.setScheduledTime(this.scheduledTime());
    visit.setReason(this.reason());
  }
}
