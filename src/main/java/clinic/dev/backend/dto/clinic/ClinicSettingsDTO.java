package clinic.dev.backend.dto.clinic;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class ClinicSettingsDTO {
  Long id; // Nullable for creation

  @NotBlank(message = "doctorName is required")
  String doctorName;

  String doctorTitle; // Optional
  String doctorQualification; // Optional

  String backupDbPath; // Internal use only (consider excluding in API responses)
  String backupImagesPath; // Internal use only

  String healingMessage;
  String printFooterNotes;

  @NotBlank(message = "language is required")
  String language;

  @NotNull(message = "backupEnabled is required")
  Boolean backupEnabled;

  String backupFrequencyCron; // Optional if backupEnabled=false
}