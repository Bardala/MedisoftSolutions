package clinic.dev.backend.dto.procedure;

import clinic.dev.backend.model.Procedure;

public record ProcedureResDTO(
    Long id,
    Long clinicId,
    String serviceName,
    String arabicName,
    String description,
    Double cost) {
  public static ProcedureResDTO fromEntity(Procedure dp) {
    return new ProcedureResDTO(
        dp.getId(),
        dp.getClinic().getId(),
        dp.getServiceName(),
        dp.getArabicName(),
        dp.getDescription(),
        dp.getCost());
  }
}