package clinic.dev.backend.dto.procedure;

import clinic.dev.backend.model.Clinic;
import clinic.dev.backend.model.Procedure;
import jakarta.validation.constraints.NotBlank;

public record ProcedureReqDTO(
    @NotBlank(message = "Service name must not be blank") String serviceName,

    @NotBlank(message = "Arabic Service name is required") String arabicName,

    String description,
    Double cost) {

  public Procedure toEntity(Long clinicId) {
    return new Procedure(
        null,
        new Clinic(clinicId),
        serviceName,
        arabicName,
        description,
        cost);
  }

  public void updateEntity(Procedure dp, Long clinicId) {
    dp.setArabicName(arabicName);
    dp.setClinic(new Clinic(clinicId));
    dp.setDescription(description);
    dp.setCost(cost);
    dp.setServiceName(serviceName);
  }
}
