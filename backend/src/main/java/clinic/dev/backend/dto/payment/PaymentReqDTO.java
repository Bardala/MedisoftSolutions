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

  public Payment toEntity(Clinic clinic, Patient patient, User recordedBy) {
    return new Payment(
        null,
        clinic,
        amount,
        patient,
        recordedBy,
        null);
  }

  public void updateEntity(Payment payment, Clinic clinic, Patient patient, User recordedBy) {
    payment.setAmount(this.amount());
    payment.setClinic(clinic);
    payment.setPatient(patient);
    payment.setRecordedBy(recordedBy);
  }
}
