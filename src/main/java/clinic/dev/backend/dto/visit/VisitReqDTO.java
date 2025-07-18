package clinic.dev.backend.dto.visit;

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
    String doctorNotes) {

  public Visit toEntity(Long clinicId) {
    return new Visit(
        null,
        new Patient(patientId),
        new Clinic(clinicId),
        new User(doctorId),
        assistantId == null ? null : new User(assistantId),
        waitTime,
        duration,
        doctorNotes,
        null);
  }

  public void updateEntity(Visit visit, Long clinicId) {
    visit.setPatient(new Patient(patientId));
    visit.setClinic(new Clinic(clinicId));
    visit.setDoctor(new User(doctorId));
    visit.setAssistant(assistantId == null ? null : new User(assistantId));
    visit.setWait(this.waitTime());
    visit.setDuration(this.duration());
    visit.setDoctorNotes(this.doctorNotes());
  }
}
