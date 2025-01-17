package clinic.dev.backend.service.impl;

import clinic.dev.backend.model.Payment;
import clinic.dev.backend.repository.PaymentRepo;
import clinic.dev.backend.service.BaseService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentService implements BaseService<Payment> {

  @Autowired
  private PaymentRepo paymentRepo;

  @Override
  public Payment create(Payment payment) {
    return paymentRepo.save(payment);
  }

  @Override
  public Payment update(Long id, Payment updatedPayment) {
    Payment existingPayment = getById(id);
    existingPayment.setRecordedBy(updatedPayment.getRecordedBy());
    existingPayment.setPatient(updatedPayment.getPatient());
    existingPayment.setAmount(updatedPayment.getAmount());
    existingPayment.setCreatedAt(updatedPayment.getCreatedAt());
    return paymentRepo.save(existingPayment);
  }

  @Override
  public void delete(Long id) {
    paymentRepo.deleteById(id);
  }

  @Override
  public Payment getById(Long id) {
    return paymentRepo.findById(id).orElseThrow(() -> new RuntimeException("Payment not found"));
  }

  @Override
  public List<Payment> getAll() {
    return paymentRepo.findAll();
  }

  // Get all payments created on the same dental workday
  public List<Payment> getPaymentsForWorkday() {
    // Workday starts at 6 AM and ends at 6 AM the next day
    LocalDateTime referenceDate = LocalDateTime.now();
    LocalDateTime workdayStart = referenceDate.toLocalDate().atTime(LocalTime.of(6, 0)); // 6 AM today
    LocalDateTime workdayEnd = workdayStart.plusHours(24); // 6 AM next day

    // Filter the payments based on the createdAt timestamp being within the workday
    return paymentRepo.findAll().stream()
        .filter(
            payment -> !payment.getCreatedAt().isBefore(workdayStart) && payment.getCreatedAt().isBefore(workdayEnd))
        .collect(Collectors.toList());
  }

  public long countPaymentsForToday() {
    LocalDateTime referenceDate = LocalDateTime.now();
    LocalDateTime workdayStart = referenceDate.toLocalDate().atTime(LocalTime.of(6, 0));
    LocalDateTime workdayEnd = workdayStart.plusHours(24);

    return paymentRepo.findAll().stream()
        .filter(
            payment -> !payment.getCreatedAt().isBefore(workdayStart) && payment.getCreatedAt().isBefore(workdayEnd))
        .count();
  }

  public double calculateMoneyCollectedToday() {
    LocalDateTime referenceDate = LocalDateTime.now();
    LocalDateTime workdayStart = referenceDate.toLocalDate().atTime(LocalTime.of(6, 0));
    LocalDateTime workdayEnd = workdayStart.plusHours(24);

    return paymentRepo.findAll().stream()
        .filter(
            payment -> !payment.getCreatedAt().isBefore(workdayStart) && payment.getCreatedAt().isBefore(workdayEnd))
        .mapToDouble(Payment::getAmount)
        .sum();
  }

}
