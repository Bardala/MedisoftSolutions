package clinic.dev.backend.dto.clinic.req;

import clinic.dev.backend.model.ClinicLimits;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record ClinicLimitsReqDTO(
    @NotNull @Min(1) Integer maxUsers,
    @NotNull @Min(1) Integer maxFileStorageMb,
    @NotNull @Min(0) Integer maxPatientRecords,
    @NotNull @Min(0) Integer maxVisitCount,
    @NotNull Boolean allowFileUpload,
    @NotNull Boolean allowMultipleBranches,
    @NotNull Boolean allowBillingFeature) {

  public ClinicLimits toEntity() {
    return ClinicLimits.builder()
        .maxUsers(maxUsers)
        .maxFileStorageMb(maxFileStorageMb)
        .maxPatientRecords(maxPatientRecords)
        .maxVisitCount(maxVisitCount)
        .allowFileUpload(allowFileUpload)
        .allowMultipleBranches(allowMultipleBranches)
        .allowBillingFeature(allowBillingFeature)
        .build();
  }

  public void updateEntity(ClinicLimits limits) {
    limits.setMaxUsers(maxUsers);
    limits.setMaxFileStorageMb(maxFileStorageMb);
    limits.setMaxPatientRecords(maxPatientRecords);
    limits.setMaxVisitCount(maxVisitCount);
    limits.setAllowFileUpload(allowFileUpload);
    limits.setAllowMultipleBranches(allowMultipleBranches);
    limits.setAllowBillingFeature(allowBillingFeature);
  }
}