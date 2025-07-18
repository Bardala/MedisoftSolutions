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
    return new Payment(
        null,
        new Clinic(clinicId),
        amount,
        new Patient(patientId),
        new User(recordedById),
        null);
  }

  public void updateEntity(Payment payment, Long clinicId) {
    payment.setAmount(this.amount());
    payment.setClinic(new Clinic(clinicId));
    payment.setPatient(new Patient(patientId));
    payment.setRecordedBy(new User(recordedById));
  }
}
