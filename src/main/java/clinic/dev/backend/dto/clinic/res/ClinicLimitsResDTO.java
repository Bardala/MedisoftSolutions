package clinic.dev.backend.dto.clinic.res;

import clinic.dev.backend.model.ClinicLimits;

public record ClinicLimitsResDTO(
    Long id,
    Integer maxUsers,
    Integer maxFileStorageMb,
    Integer maxPatientRecords,
    Boolean allowFileUpload,
    Boolean allowMultipleBranches,
    Boolean allowBillingFeature) {

  public static ClinicLimitsResDTO fromEntity(ClinicLimits limits) {
    return new ClinicLimitsResDTO(
        limits.getId(),
        limits.getMaxUsers(),
        limits.getMaxFileStorageMb(),
        limits.getMaxPatientRecords(),
        limits.getAllowFileUpload(),
        limits.getAllowMultipleBranches(),
        limits.getAllowBillingFeature());
  }
}