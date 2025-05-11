package clinic.dev.backend.dto.visitPayment;

import clinic.dev.backend.model.VisitPayment;

public record VisitPaymentResDTO(
    Long id,
    Long visitId,
    Long paymentId,
    Double paymentAmount,
    Long clinicId) {

  public static VisitPaymentResDTO fromEntity(VisitPayment vp) {
    return new VisitPaymentResDTO(
        vp.getId(),
        vp.getVisit().getId(),
        vp.getPayment().getId(),
        vp.getPayment().getAmount(),
        vp.getClinic().getId());
  }
}