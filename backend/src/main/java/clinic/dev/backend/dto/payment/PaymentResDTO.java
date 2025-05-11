package clinic.dev.backend.dto.payment;

import java.time.LocalDateTime;

import clinic.dev.backend.model.Payment;

public record PaymentResDTO(
    Long id,
    Long clinicId,
    Double amount,
    Long patientId,
    String patientName,
    Long recordedById,
    String recordedByName,
    LocalDateTime createdAt) {

  public static PaymentResDTO fromEntity(Payment payment) {
    return new PaymentResDTO(
        payment.getId(),
        payment.getClinic().getId(),
        payment.getAmount(),
        payment.getPatient().getId(),
        payment.getPatient().getFullName(),
        payment.getRecordedBy().getId(),
        payment.getRecordedBy().getName(),
        payment.getCreatedAt());
  }
}