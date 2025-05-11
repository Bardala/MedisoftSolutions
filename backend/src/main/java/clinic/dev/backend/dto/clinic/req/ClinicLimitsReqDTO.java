package clinic.dev.backend.dto.clinic.req;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record ClinicLimitsReqDTO(
        @NotNull @Min(1) Integer maxUsers,
        @NotNull @Min(1) Integer maxFileStorageMb,
        @NotNull @Min(0) Integer maxPatientRecords,
        @NotNull Boolean allowFileUpload,
        @NotNull Boolean allowMultipleBranches,
        @NotNull Boolean allowBillingFeature) {
}
