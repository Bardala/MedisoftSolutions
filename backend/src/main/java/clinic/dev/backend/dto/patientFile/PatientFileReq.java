package clinic.dev.backend.dto.patientFile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PatientFileReq {
  @NotNull(message = "Patient ID is required.")
  private Long patientId;

  @NotBlank(message = "File type is required.")
  private String fileType;

  private String description; // Optional
}
