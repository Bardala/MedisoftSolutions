package clinic.dev.backend.dto.visitProcedure;

import clinic.dev.backend.model.VisitDentalProcedure;

public record VisitProcedureResDTO(
    Long id,
    Long visitId,
    Long dentalProcedureId,
    String dentalProcedureName,
    Long clinicId) {

  public static VisitProcedureResDTO fromEntity(VisitDentalProcedure vdp) {
    return new VisitProcedureResDTO(
        vdp.getId(),
        vdp.getVisit().getId(),
        vdp.getDentalProcedure().getId(),
        vdp.getDentalProcedure().getServiceName(),
        vdp.getClinic().getId());
  }
}