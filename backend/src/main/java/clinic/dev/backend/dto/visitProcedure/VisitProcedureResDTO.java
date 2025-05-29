package clinic.dev.backend.dto.visitProcedure;

import clinic.dev.backend.model.VisitDentalProcedure;

public record VisitProcedureResDTO(
    Long id,
    Long visitId,

    Long dentalProcedureId,
    String procedureName,
    String procedureArabicName,
    String procedureDescription,
    Double procedureCost,

    Long clinicId) {

  public static VisitProcedureResDTO fromEntity(VisitDentalProcedure vdp) {
    return new VisitProcedureResDTO(
        vdp.getId(),
        vdp.getVisit().getId(),

        vdp.getDentalProcedure().getId(),
        vdp.getDentalProcedure().getServiceName(),
        vdp.getDentalProcedure().getArabicName(),
        vdp.getDentalProcedure().getDescription(),
        vdp.getDentalProcedure().getCost(),

        vdp.getClinic().getId());
  }
}