package clinic.dev.backend.dto.queue;

import clinic.dev.backend.model.Clinic;
import clinic.dev.backend.model.Patient;
import clinic.dev.backend.model.Queue;
import clinic.dev.backend.model.Queue.Status;
import clinic.dev.backend.model.User;
import jakarta.validation.constraints.NotNull;

public record QueueReqDTO(
    @NotNull(message = "Patient ID cannot be null") Long patientId,

    @NotNull(message = "Doctor ID cannot be null") Long doctorId,

    // Optional
    Long assistantId

) {
  public Queue toEntity(Long clinicId, Integer position, Status status) {
    return new Queue(
        null,
        new Clinic(clinicId),
        new Patient(patientId),
        new User(doctorId),
        assistantId == null ? null : new User(assistantId),
        position,
        status,
        null,
        null,
        null);
  }

  public void updateEntity(Long clinicId, Queue queue) {
    queue.setAssistant(assistantId == null ? null : new User(assistantId));
    queue.setClinic(new Clinic(clinicId));
    queue.setDoctor(new User(doctorId));
  }
}