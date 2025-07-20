package clinic.dev.backend.dto.queue;

import java.time.Instant;

import clinic.dev.backend.model.Queue;
import clinic.dev.backend.model.Queue.Status;

public record QueueResDTO(
    Long id,
    Long clinicId,

    Long patientId,
    String patientName,

    Long doctorId,
    String doctorName,

    Long assistantId,
    String assistantName,

    Integer position,
    Status status,
    Integer estimatedWaitTime,
    Instant createdAt,
    Instant updatedAt) {

  public static QueueResDTO fromEntity(Queue queue) {
    return new QueueResDTO(
        queue.getId(),
        queue.getClinic().getId(),

        queue.getPatient().getId(),
        queue.getPatient().getFullName(),

        queue.getDoctor().getId(),
        queue.getDoctor().getName(),

        queue.getAssistant() == null ? null : queue.getAssistant().getId(),
        queue.getAssistant() == null ? null : queue.getAssistant().getName(),

        queue.getPosition(),
        queue.getStatus(),
        queue.getEstimatedWaitTime(),
        queue.getCreatedAt(),
        queue.getUpdatedAt());
  }
}
