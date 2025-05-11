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

  public Visit toEntity(Patient patient, Clinic clinic, User doctor, User assistant) {
    return new Visit(
        null,
        patient,
        clinic,
        doctor,
        assistant,
        waitTime,
        duration,
        doctorNotes,
        null);
  }

  public void updateEntity(Visit visit, Patient patient, Clinic clinic, User doctor, User assistant) {
    visit.setPatient(patient);
    visit.setClinic(clinic);
    visit.setDoctor(doctor);
    visit.setAssistant(assistant);
    visit.setWait(this.waitTime());
    visit.setDuration(this.duration());
    visit.setDoctorNotes(this.doctorNotes());
  }
}
