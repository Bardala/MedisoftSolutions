package clinic.dev.backend.dto.clinic.res;

public record ClinicLimitsResDTO(
    Long id,
    Integer maxUsers,
    Integer maxFileStorageMb,
    Integer maxPatientRecords,
    Boolean allowFileUpload,
    Boolean allowMultipleBranches,
    Boolean allowBillingFeature) {
}