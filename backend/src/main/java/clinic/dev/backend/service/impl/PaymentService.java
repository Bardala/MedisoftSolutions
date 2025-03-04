package clinic.dev.backend.service.impl;

import clinic.dev.backend.model.Payment;
import clinic.dev.backend.repository.PaymentRepo;
import clinic.dev.backend.repository.VisitPaymentRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentService {

  @Autowired
  private PaymentRepo paymentRepo;

  @Autowired
  private VisitPaymentRepo visitPaymentRepo;

  @Transactional
  public Payment create(Payment payment) {
    return paymentRepo.save(payment);
  }

  @Transactional
  public Payment update(Payment updatedPayment) {
    Payment existingPayment = getById(updatedPayment.getId());
    existingPayment.setRecordedBy(updatedPayment.getRecordedBy());
    existingPayment.setPatient(updatedPayment.getPatient());
    existingPayment.setAmount(updatedPayment.getAmount());
    existingPayment.setCreatedAt(updatedPayment.getCreatedAt());
    return paymentRepo.save(existingPayment);
  }

  @Transactional
  public void delete(Long id) {
    visitPaymentRepo.deleteByPaymentId(id);
    paymentRepo.deleteById(id);
  }

  public Payment getById(Long id) {
    return paymentRepo.findById(id).orElseThrow(() -> new RuntimeException("Payment not found"));
  }

  public List<Payment> getAll() {
    return paymentRepo.findAll();
  }

  public List<Payment> getPaymentsForWorkday() {
    LocalDateTime referenceDate = LocalDateTime.now();
    LocalDateTime workdayStart = referenceDate.with(LocalTime.of(6, 0)); // 6 AM today
    LocalDateTime workdayEnd = workdayStart.plusHours(24); // 6 AM next day

    // if the current time is after 12 AM and before 6 AM
    if (referenceDate.isBefore(workdayStart)) {
      LocalDateTime at12Am = referenceDate.with(LocalTime.MIN); // 12 AM today
      LocalDateTime at6Am = at12Am.plusHours(6); // 6 AM today

      List<Payment> paymentsFrom0to6Am = getPaymentsAtThisPeriod(at12Am, at6Am);

      // Now we have to get the payments from the previous day from 6 AM to 12 AM
      LocalDateTime after6AmYesterday = workdayStart.minusDays(1).with(LocalTime.of(6, 0));

      List<Payment> paymentsAfter6AmYesterday = getPaymentsAtThisPeriod(after6AmYesterday, at12Am);

      paymentsFrom0to6Am.addAll(paymentsAfter6AmYesterday);

      return paymentsFrom0to6Am;
    }

    return getPaymentsAtThisPeriod(workdayStart, workdayEnd);
  }

  public List<Payment> getPaymentsForDate(LocalDate date) {
    LocalDateTime workdayStart = date.atTime(6, 0); // 6 AM on the given date
    LocalDateTime workdayEnd = workdayStart.plusHours(24); // 6 AM the next day

    // If the date is today and the current time is before 6 AM, adjust the period
    if (date.isEqual(LocalDate.now()) && LocalDateTime.now().isBefore(workdayStart)) {
      LocalDateTime at12Am = date.atTime(LocalTime.MIN); // 12 AM on the given date
      LocalDateTime at6Am = at12Am.plusHours(6); // 6 AM on the given date

      List<Payment> paymentsFrom0to6Am = getPaymentsAtThisPeriod(at12Am, at6Am);

      // Get payments from the previous day (6 AM to 12 AM)
      LocalDateTime after6AmYesterday = workdayStart.minusDays(1).with(LocalTime.of(6, 0));
      List<Payment> paymentsAfter6AmYesterday = getPaymentsAtThisPeriod(after6AmYesterday, at12Am);

      paymentsFrom0to6Am.addAll(paymentsAfter6AmYesterday);

      return paymentsFrom0to6Am;
    }

    return getPaymentsAtThisPeriod(workdayStart, workdayEnd);
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

  public List<Payment> getPaymentsAtThisPeriod(LocalDateTime start, LocalDateTime end) {
    return paymentRepo.findAll().stream()
        .filter(
            payment -> !payment.getCreatedAt().isBefore(start) && payment.getCreatedAt().isBefore(end))
        .collect(Collectors.toList());
  }

}
