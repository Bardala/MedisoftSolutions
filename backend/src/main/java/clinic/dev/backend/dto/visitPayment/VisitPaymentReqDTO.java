package clinic.dev.backend.dto.visitPayment;

import clinic.dev.backend.model.Clinic;
import clinic.dev.backend.model.Payment;
import clinic.dev.backend.model.Visit;
import clinic.dev.backend.model.VisitPayment;
import jakarta.validation.constraints.NotNull;

public record VisitPaymentReqDTO(
    @NotNull(message = "Visit ID is required") Long visitId,
    @NotNull(message = "Payment ID is required") Long paymentId) {

  public VisitPayment toEntity(Visit visit, Payment payment, Clinic clinic) {
    return new VisitPayment(
        null,
        visit,
        payment,
        clinic);
  }

  public void updateEntity(VisitPayment visitPayment, Visit visit, Payment payment, Clinic clinic) {
    visitPayment.setVisit(visit);
    visitPayment.setPayment(payment);
    visitPayment.setClinic(clinic);
  }
}
