package clinic.dev.backend.dto.queue;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddPatientToQueueReq {
  @NotNull(message = "Patient ID cannot be null")
  private Long patientId;

  @NotNull(message = "Doctor ID cannot be null")
  private Long doctorId;

  private Long assistantId; // Optional
}
