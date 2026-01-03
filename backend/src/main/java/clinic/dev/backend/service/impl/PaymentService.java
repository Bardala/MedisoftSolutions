package clinic.dev.backend.service.impl;

import clinic.dev.backend.dto.payment.PaymentReqDTO;
import clinic.dev.backend.dto.payment.PaymentResDTO;
import clinic.dev.backend.exceptions.ResourceNotFoundException;
import clinic.dev.backend.exceptions.BadRequestException;
import clinic.dev.backend.model.Payment;
import clinic.dev.backend.repository.PaymentRepo;
import clinic.dev.backend.repository.VisitPaymentRepo;
import clinic.dev.backend.util.AuthContext;
import clinic.dev.backend.util.WorkdayWindowUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
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
    LocalDate today = LocalDate.now();
    WorkdayWindowUtil.TimeWindow window = WorkdayWindowUtil.resolveWorkdayWindow(today);

    return paymentRepo.findByClinicIdAndCreatedAtBetween(clinicId, window.start(), window.end())
        .stream()
        .map(PaymentResDTO::fromEntity)
        .collect(Collectors.toList());
  }

  public List<PaymentResDTO> getPaymentsForDate(LocalDate date) {
    Long clinicId = authContext.getClinicId();
    WorkdayWindowUtil.TimeWindow window = WorkdayWindowUtil.resolveWorkdayWindow(date);

    return paymentRepo.findPaymentsBetween(window.start(), window.end(), clinicId)
        .stream()
        .map(PaymentResDTO::fromEntity)
        .collect(Collectors.toList());
  }

  public long countPaymentsForToday() {
    Long clinicId = authContext.getClinicId();
    LocalDate today = LocalDate.now();
    WorkdayWindowUtil.TimeWindow window = WorkdayWindowUtil.resolveWorkdayWindow(today);

    return paymentRepo.countPaymentsBetween(window.start(), window.end(), clinicId);
  }

  public double calculateMoneyCollectedToday() {
    Long clinicId = authContext.getClinicId();
    LocalDate today = LocalDate.now();
    WorkdayWindowUtil.TimeWindow window = WorkdayWindowUtil.resolveWorkdayWindow(today);

    return paymentRepo.sumPaymentsBetween(window.start(), window.end(), clinicId);
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
