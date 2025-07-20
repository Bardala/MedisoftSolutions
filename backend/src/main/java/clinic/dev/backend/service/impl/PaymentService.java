package clinic.dev.backend.service.impl;

import clinic.dev.backend.dto.payment.PaymentReqDTO;
import clinic.dev.backend.dto.payment.PaymentResDTO;
import clinic.dev.backend.exceptions.ResourceNotFoundException;
import clinic.dev.backend.exceptions.BadRequestException;
import clinic.dev.backend.model.Payment;
import clinic.dev.backend.repository.PaymentRepo;
import clinic.dev.backend.repository.VisitPaymentRepo;
import clinic.dev.backend.util.AuthContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Instant;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class PaymentService {

  @Autowired
  private PaymentRepo paymentRepo;

  @Autowired
  private VisitPaymentRepo visitPaymentRepo;

  @Autowired
  private AuthContext authContext;

  private Long getClinicId() {
    return authContext.getClinicId();
  }

  @Transactional
  public PaymentResDTO create(PaymentReqDTO req) {
    Long clinicId = getClinicId();
    Payment payment = req.toEntity(clinicId);
    payment = paymentRepo.save(payment);

    return paymentRepo.findPaymentDtoByIdAndClinicId(payment.getId(), clinicId)
        .orElseThrow(() -> new RuntimeException("Payment not found after save"));
  }

  @Transactional
  public PaymentResDTO update(Long id, PaymentReqDTO req) {
    Long clinicId = getClinicId();

    Payment payment = paymentRepo.findByIdAndClinicId(id, clinicId)
        .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

    req.updateEntity(payment, clinicId);
    paymentRepo.save(payment);

    return paymentRepo.findPaymentDtoByIdAndClinicId(id, clinicId)
        .orElseThrow(() -> new RuntimeException("Failed to load payment after update"));
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
    Long clinicId = authContext.getClinicId();
    Instant now = Instant.now();
    ZonedDateTime zonedNow = now.atZone(ZoneId.systemDefault());

    // Get workday start (6 AM today in local time)
    ZonedDateTime workdayStartZoned = zonedNow.with(LocalTime.of(6, 0));
    Instant workdayStart = workdayStartZoned.toInstant();
    Instant workdayEnd = workdayStart.plus(24, ChronoUnit.HOURS);

    if (now.isBefore(workdayStart)) {
      // Current time is between midnight and 6 AM
      ZonedDateTime midnightZoned = zonedNow.with(LocalTime.MIN);
      Instant midnight = midnightZoned.toInstant();
      Instant sixAm = midnight.plus(6, ChronoUnit.HOURS);

      // Get payments from midnight to 6 AM today
      List<Payment> paymentsMorning = paymentRepo.findPaymentsBetween(
          midnight, sixAm, clinicId);

      // Get payments from 6 AM yesterday to midnight today
      ZonedDateTime yesterdaySixAmZoned = workdayStartZoned.minusDays(1);
      Instant yesterdaySixAm = yesterdaySixAmZoned.toInstant();

      List<Payment> paymentsYesterday = paymentRepo.findPaymentsBetween(
          yesterdaySixAm, midnight, clinicId);

      // Combine results
      List<Payment> combined = new ArrayList<>();
      combined.addAll(paymentsMorning);
      combined.addAll(paymentsYesterday);

      return combined.stream()
          .map(PaymentResDTO::fromEntity)
          .collect(Collectors.toList());
    }

    // Normal case - current time is after 6 AM
    return paymentRepo.findPaymentsBetween(workdayStart, workdayEnd, clinicId)
        .stream()
        .map(PaymentResDTO::fromEntity)
        .collect(Collectors.toList());
  }

  public List<PaymentResDTO> getPaymentsForDate(LocalDate date) {
    Long clinicId = authContext.getClinicId();
    Instant now = Instant.now();

    // Convert date to workday start (6 AM in local time)
    ZonedDateTime workdayStartZoned = date.atTime(6, 0).atZone(ZoneId.systemDefault());
    Instant workdayStart = workdayStartZoned.toInstant();
    Instant workdayEnd = workdayStart.plus(24, ChronoUnit.HOURS);

    ZonedDateTime nowZoned = now.atZone(ZoneId.systemDefault());
    if (date.equals(nowZoned.toLocalDate()) && now.isBefore(workdayStart)) {
      // For today before 6 AM
      ZonedDateTime midnightZoned = date.atStartOfDay(ZoneId.systemDefault());
      Instant midnight = midnightZoned.toInstant();
      Instant sixAm = midnight.plus(6, ChronoUnit.HOURS);

      // Get payments from midnight to 6 AM today
      List<Payment> paymentsMorning = paymentRepo.findPaymentsBetween(
          midnight, sixAm, clinicId);

      // Get payments from 6 AM yesterday to midnight today
      ZonedDateTime yesterdaySixAmZoned = workdayStartZoned.minusDays(1);
      Instant yesterdaySixAm = yesterdaySixAmZoned.toInstant();

      List<Payment> paymentsYesterday = paymentRepo.findPaymentsBetween(
          yesterdaySixAm, midnight, clinicId);

      // Combine results
      List<Payment> combined = new ArrayList<>();
      combined.addAll(paymentsMorning);
      combined.addAll(paymentsYesterday);

      return combined.stream()
          .map(PaymentResDTO::fromEntity)
          .collect(Collectors.toList());
    }

    // Normal case
    return paymentRepo.findPaymentsBetween(workdayStart, workdayEnd, clinicId)
        .stream()
        .map(PaymentResDTO::fromEntity)
        .collect(Collectors.toList());
  }

  public long countPaymentsForToday() {
    Long clinicId = authContext.getClinicId();
    Instant now = Instant.now();
    ZonedDateTime zonedNow = now.atZone(ZoneId.systemDefault());

    ZonedDateTime workdayStartZoned = zonedNow.with(LocalTime.of(6, 0));
    Instant workdayStart = workdayStartZoned.toInstant();
    Instant workdayEnd = workdayStart.plus(24, ChronoUnit.HOURS);

    if (now.isBefore(workdayStart)) {
      // Current time is between midnight and 6 AM
      ZonedDateTime midnightZoned = zonedNow.with(LocalTime.MIN);
      Instant midnight = midnightZoned.toInstant();
      Instant sixAm = midnight.plus(6, ChronoUnit.HOURS);

      // Count payments from midnight to 6 AM today
      long morningCount = paymentRepo.countPaymentsBetween(
          midnight, sixAm, clinicId);

      // Count payments from 6 AM yesterday to midnight today
      ZonedDateTime yesterdaySixAmZoned = workdayStartZoned.minusDays(1);
      Instant yesterdaySixAm = yesterdaySixAmZoned.toInstant();

      long yesterdayCount = paymentRepo.countPaymentsBetween(
          yesterdaySixAm, midnight, clinicId);

      return morningCount + yesterdayCount;
    }

    // Normal case - current time is after 6 AM
    return paymentRepo.countPaymentsBetween(workdayStart, workdayEnd, clinicId);
  }

  public double calculateMoneyCollectedToday() {
    Long clinicId = authContext.getClinicId();
    Instant now = Instant.now();
    ZonedDateTime zonedNow = now.atZone(ZoneId.systemDefault());

    ZonedDateTime workdayStartZoned = zonedNow.with(LocalTime.of(6, 0));
    Instant workdayStart = workdayStartZoned.toInstant();
    Instant workdayEnd = workdayStart.plus(24, ChronoUnit.HOURS);

    if (now.isBefore(workdayStart)) {
      // Current time is between midnight and 6 AM
      ZonedDateTime midnightZoned = zonedNow.with(LocalTime.MIN);
      Instant midnight = midnightZoned.toInstant();
      Instant sixAm = midnight.plus(6, ChronoUnit.HOURS);

      // Sum payments from midnight to 6 AM today
      double morningSum = paymentRepo.sumPaymentsBetween(
          midnight, sixAm, clinicId);

      // Sum payments from 6 AM yesterday to midnight today
      ZonedDateTime yesterdaySixAmZoned = workdayStartZoned.minusDays(1);
      Instant yesterdaySixAm = yesterdaySixAmZoned.toInstant();

      double yesterdaySum = paymentRepo.sumPaymentsBetween(
          yesterdaySixAm, midnight, clinicId);

      return morningSum + yesterdaySum;
    }

    // Normal case - current time is after 6 AM
    return paymentRepo.sumPaymentsBetween(workdayStart, workdayEnd, clinicId);
  }

  public List<PaymentResDTO> getPaymentsByIds(List<Long> ids) {
    if (ids == null || ids.isEmpty()) {
      throw new BadRequestException("Payment IDs cannot be empty");
    }

    List<Payment> payments = paymentRepo.findByIdInAndClinicId(ids, authContext.getClinicId());

    if (payments.size() != ids.size()) {
      Set<Long> foundIds = payments.stream()
          .map(Payment::getId)
          .collect(Collectors.toSet());

      List<Long> missingIds = ids.stream()
          .filter(id -> !foundIds.contains(id))
          .collect(Collectors.toList());

      throw new ResourceNotFoundException(
          "Some Payment not found or not accessible: " + missingIds);
    }

    return payments.stream()
        .map(PaymentResDTO::fromEntity)
        .collect(Collectors.toList());

  }
}
