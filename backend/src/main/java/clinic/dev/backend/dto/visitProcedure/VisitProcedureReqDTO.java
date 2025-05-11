package clinic.dev.backend.dto.visitProcedure;

import clinic.dev.backend.model.Clinic;
import clinic.dev.backend.model.DentalProcedure;
import clinic.dev.backend.model.Visit;
import clinic.dev.backend.model.VisitDentalProcedure;
import jakarta.validation.constraints.NotNull;

public record VisitProcedureReqDTO(
    @NotNull(message = "Visit ID is required") Long visitId,
    @NotNull(message = "Service ID is required") Long dentalProcedureId) {

  public VisitDentalProcedure toEntity(Visit visit, DentalProcedure dentalProcedure, Clinic clinic) {
    return new VisitDentalProcedure(
        null,
        visit,
        dentalProcedure,
        clinic);
  }

  public void updateEntity(VisitDentalProcedure procedure, Visit visit, DentalProcedure dentalProcedure,
      Clinic clinic) {
    procedure.setVisit(visit);
    procedure.setDentalProcedure(dentalProcedure);
    procedure.setClinic(clinic);
  }
}
