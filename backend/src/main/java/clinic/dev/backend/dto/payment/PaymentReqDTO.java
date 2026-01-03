package clinic.dev.backend.dto.payment;

import clinic.dev.backend.model.Clinic;
import clinic.dev.backend.model.Patient;
import clinic.dev.backend.model.Payment;
import clinic.dev.backend.model.User;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record PaymentReqDTO(
    @NotNull(message = "Amount is required") @Positive(message = "Amount must be positive") Double amount,

    @NotNull(message = "Patient ID is required") Long patientId,

    @NotNull(message = "Recorded by user ID is required") Long recordedById) {

  public Payment toEntity(Long clinicId) {
    return Payment.builder()
        .amount(this.amount())
        .clinic(new Clinic(clinicId))
        .patient(new Patient(patientId))
        .recordedBy(new User(recordedById))
        .build();
  }

  public void updateEntity(Payment payment, Long clinicId) {
    payment.setAmount(this.amount());
    payment.setClinic(new Clinic(clinicId));
    payment.setPatient(new Patient(patientId));
    payment.setRecordedBy(new User(recordedById));
  }
}
