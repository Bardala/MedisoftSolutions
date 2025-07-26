package clinic.dev.backend.dto.clinic.res;

import java.time.Instant;

import clinic.dev.backend.model.ClinicUsage;

public record ClinicUsageResDTO(
    Long id,
    Long clinicId,
    Integer visitCount,
    Integer patientCount,
    Instant lastVisitAdded) {

  public static ClinicUsageResDTO fromEntity(ClinicUsage clinicUsage) {
    return new ClinicUsageResDTO(
        clinicUsage.getId(),
        clinicUsage.getClinic().getId(),
        clinicUsage.getVisitCount(),
        clinicUsage.getPatientCount(),
        clinicUsage.getLastVisitAdded());
  }
}