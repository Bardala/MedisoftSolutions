package clinic.dev.backend.service.impl;

import clinic.dev.backend.model.Payment;
import clinic.dev.backend.repository.PaymentRepo;
import clinic.dev.backend.service.BaseService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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
    existingPayment.setDate(updatedPayment.getDate());
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
}
