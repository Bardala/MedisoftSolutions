package clinic.dev.backend.service.impl;

import clinic.dev.backend.dto.payment.PaymentReqDTO;
import clinic.dev.backend.dto.payment.PaymentResDTO;
import clinic.dev.backend.exceptions.ResourceNotFoundException;
import clinic.dev.backend.model.Payment;
import clinic.dev.backend.repository.PaymentRepo;
import clinic.dev.backend.repository.VisitPaymentRepo;
import clinic.dev.backend.util.AuthContext;

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

  @Autowired
  private AuthContext authContext;

  @Transactional
  public PaymentResDTO create(PaymentReqDTO req) {
    Payment payment = req.toEntity(getClinicId());

    return PaymentResDTO.fromEntity(paymentRepo.save(payment));
  }

  private Long getClinicId() {
    return authContext.getClinicId();
  }

  @Transactional
  public PaymentResDTO update(Long id, PaymentReqDTO req) {

    Payment payment = paymentRepo.findByIdAndClinicId(id, getClinicId())
        .orElseThrow(() -> new ResourceNotFoundException("Visit not found"));

    req.updateEntity(payment, getClinicId());

    return PaymentResDTO.fromEntity(paymentRepo.save(payment));
  }

  @Transactional
  public void delete(Long id) {
    visitPaymentRepo.deleteByPaymentIdAndClinicId(id, getClinicId());
    paymentRepo.deleteByIdAndClinicId(id, getClinicId());
  }

  public PaymentResDTO getById(Long id) {
    Payment payment = paymentRepo
        .findByIdAndClinicId(id, getClinicId())
        .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
    return PaymentResDTO.fromEntity(payment);
  }

  public List<PaymentResDTO> getAll() {
    List<Payment> payments = paymentRepo.findAllByClinicId(getClinicId());

    return payments.stream().map(PaymentResDTO::fromEntity).toList();
  }

  public List<PaymentResDTO> getPaymentsForWorkday() {
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

      return paymentsFrom0to6Am.stream().map(PaymentResDTO::fromEntity).toList();
    }

    return getPaymentsAtThisPeriod(workdayStart, workdayEnd).stream().map(PaymentResDTO::fromEntity).toList();
  }

  public List<PaymentResDTO> getPaymentsForDate(LocalDate date) {
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

      return paymentsFrom0to6Am.stream().map(PaymentResDTO::fromEntity).toList();
    }

    return getPaymentsAtThisPeriod(workdayStart, workdayEnd).stream().map(PaymentResDTO::fromEntity).toList();
  }

  public long countPaymentsForToday() {
    LocalDateTime referenceDate = LocalDateTime.now();
    LocalDateTime workdayStart = referenceDate.toLocalDate().atTime(LocalTime.of(6, 0));
    LocalDateTime workdayEnd = workdayStart.plusHours(24);

    return paymentRepo.findAllByClinicId(getClinicId()).stream()
        .filter(
            payment -> !payment.getCreatedAt().isBefore(workdayStart) && payment.getCreatedAt().isBefore(workdayEnd))
        .count();
  }

  public double calculateMoneyCollectedToday() {
    LocalDateTime referenceDate = LocalDateTime.now();
    LocalDateTime workdayStart = referenceDate.toLocalDate().atTime(LocalTime.of(6, 0));
    LocalDateTime workdayEnd = workdayStart.plusHours(24);

    return paymentRepo.findAllByClinicId(getClinicId()).stream()
        .filter(
            payment -> !payment.getCreatedAt().isBefore(workdayStart) && payment.getCreatedAt().isBefore(workdayEnd))
        .mapToDouble(Payment::getAmount)
        .sum();
  }

  private List<Payment> getPaymentsAtThisPeriod(LocalDateTime start, LocalDateTime end) {
    return paymentRepo.findAllByClinicId(getClinicId()).stream()
        .filter(
            payment -> !payment.getCreatedAt().isBefore(start) && payment.getCreatedAt().isBefore(end))
        .collect(Collectors.toList());
  }

}
