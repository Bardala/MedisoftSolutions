package clinic.dev.backend.dto.patient;

import clinic.dev.backend.model.*;
import lombok.Data;

import java.util.List;

@Data
public class PatientRegistryRes {
  private Patient patient;
  private List<Visit> visits;
  private List<Payment> payments;
  private List<VisitDentalProcedure> visitDentalProcedure;
  private List<VisitPayment> visitPayments;
  private List<VisitMedicine> medicines;
}