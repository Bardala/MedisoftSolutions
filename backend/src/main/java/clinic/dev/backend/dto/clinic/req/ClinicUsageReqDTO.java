package clinic.dev.backend.dto.clinic.req;

import clinic.dev.backend.model.Clinic;
import clinic.dev.backend.model.ClinicUsage;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record ClinicUsageReqDTO(
    @NotNull @Min(1) Long clinicId,
    @NotNull @Min(0) Integer visitCount,
    @NotNull @Min(0) Integer patientCount) {

  public ClinicUsage toEntity() {
    return ClinicUsage.builder()
        .clinic(new Clinic(clinicId))
        .visitCount(visitCount)
        .patientCount(patientCount)
        .lastVisitAdded(java.time.Instant.now())
        .build();
  }

  public void updateEntity(ClinicUsage clinicUsage) {
    clinicUsage.setVisitCount(visitCount);
    clinicUsage.setPatientCount(patientCount);
    clinicUsage.setLastVisitAdded(java.time.Instant.now());
  }
}