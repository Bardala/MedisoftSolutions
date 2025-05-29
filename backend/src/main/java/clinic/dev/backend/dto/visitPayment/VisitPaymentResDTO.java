package clinic.dev.backend.dto.visitPayment;

import java.time.LocalDateTime;

import clinic.dev.backend.model.VisitPayment;

public record VisitPaymentResDTO(
    Long id,
    Long visitId,

    Long paymentId,
    Double paymentAmount,
    String patientName,
    String patientPhone,
    Long recordedById,
    String recordedBy,
    LocalDateTime createdAt,

    Long clinicId) {

  public static VisitPaymentResDTO fromEntity(VisitPayment vp) {
    return new VisitPaymentResDTO(
        vp.getId(),
        vp.getVisit().getId(),

        vp.getPayment().getId(),
        vp.getPayment().getAmount(),
        vp.getPayment().getPatient().getFullName(),
        vp.getPayment().getPatient().getPhone(),
        vp.getPayment().getRecordedBy().getId(),
        vp.getPayment().getRecordedBy().getName(),
        vp.getPayment().getCreatedAt(),

        vp.getClinic().getId());
  }
}