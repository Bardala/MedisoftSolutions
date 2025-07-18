package clinic.dev.backend.dto.patient;

import clinic.dev.backend.dto.payment.PaymentResDTO;
import clinic.dev.backend.dto.visit.VisitResDTO;
import clinic.dev.backend.dto.visitMedicine.VisitMedicineResDTO;
import clinic.dev.backend.dto.visitPayment.VisitPaymentResDTO;
import clinic.dev.backend.dto.visitProcedure.VisitProcedureResDTO;
import lombok.Data;

import java.util.List;

@Data
public class PatientRegistryRes {
  private PatientResDTO patient;
  private List<VisitResDTO> visits;
  private List<PaymentResDTO> payments;
  private List<VisitProcedureResDTO> visitDentalProcedure;
  private List<VisitPaymentResDTO> visitPayments;
  private List<VisitMedicineResDTO> visitMedicines;
}