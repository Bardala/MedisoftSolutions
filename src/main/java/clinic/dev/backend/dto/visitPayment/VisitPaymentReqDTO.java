package clinic.dev.backend.dto.visitPayment;

import clinic.dev.backend.model.Clinic;
import clinic.dev.backend.model.Payment;
import clinic.dev.backend.model.Visit;
import clinic.dev.backend.model.VisitPayment;
import jakarta.validation.constraints.NotNull;

public record VisitPaymentReqDTO(
    @NotNull(message = "Visit ID is required") Long visitId,
    @NotNull(message = "Payment ID is required") Long paymentId) {

  public VisitPayment toEntity(Long visitId, Long paymentId, Long clinicId) {
    return new VisitPayment(
        null,
        new Visit(visitId),
        new Payment(paymentId),
        new Clinic(clinicId));
  }

  public void updateEntity(VisitPayment visitPayment, Long clinicId) {
    visitPayment.setVisit(new Visit(visitId));
    visitPayment.setPayment(new Payment(paymentId));
    visitPayment.setClinic(new Clinic(clinicId));
  }
}
