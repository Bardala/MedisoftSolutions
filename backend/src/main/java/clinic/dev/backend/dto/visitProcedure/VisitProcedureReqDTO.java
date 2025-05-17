package clinic.dev.backend.dto.visitProcedure;

import clinic.dev.backend.model.Clinic;
import clinic.dev.backend.model.Procedure;
import clinic.dev.backend.model.Visit;
import clinic.dev.backend.model.VisitDentalProcedure;
import jakarta.validation.constraints.NotNull;

public record VisitProcedureReqDTO(
    @NotNull(message = "Visit ID is required") Long visitId,
    @NotNull(message = "Service ID is required") Long procedureId) {

  public VisitDentalProcedure toEntity(Long clinicId) {
    return new VisitDentalProcedure(
        null,
        new Visit(visitId),
        new Procedure(procedureId),
        new Clinic(clinicId));
  }

  public void updateEntity(VisitDentalProcedure vm, Long clinicId) {
    vm.setVisit(new Visit(visitId));
    vm.setDentalProcedure(new Procedure(procedureId));
    vm.setClinic(new Clinic(clinicId));
  }
}
