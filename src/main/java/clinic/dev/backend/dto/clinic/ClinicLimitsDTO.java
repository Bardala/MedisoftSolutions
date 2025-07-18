package clinic.dev.backend.dto.clinic;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Value;

@Value // Immutable (all fields are final)
@Builder
public class ClinicLimitsDTO {
  Long id; // Nullable for creation, populated for responses

  @NotNull(message = "maxUsers is required")
  @Min(value = 1, message = "maxUsers must be at least 1")
  Integer maxUsers;

  @NotNull(message = "maxFileStorageMb is required")
  @Min(value = 1, message = "maxFileStorageMb must be at least 1MB")
  Integer maxFileStorageMb;

  @NotNull(message = "maxPatientRecords is required")
  @Min(value = 0, message = "maxPatientRecords cannot be negative")
  Integer maxPatientRecords;

  @NotNull(message = "allowFileUpload is required")
  Boolean allowFileUpload;

  @NotNull(message = "allowMultipleBranches is required")
  Boolean allowMultipleBranches;

  @NotNull(message = "allowBillingFeature is required")
  Boolean allowBillingFeature;
}