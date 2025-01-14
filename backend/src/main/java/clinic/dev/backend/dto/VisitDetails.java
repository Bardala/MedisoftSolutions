package clinic.dev.backend.dto;

import clinic.dev.backend.model.*;
import lombok.Data;

import java.util.List;

@Data
public class VisitDetails {
  private Visit visit;
  private List<VisitDentalProcedure> dentalProcedures;
  private List<VisitMedicine> medicines;
  private List<VisitPayment> payments;
}