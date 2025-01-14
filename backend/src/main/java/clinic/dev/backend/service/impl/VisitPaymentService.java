package clinic.dev.backend.service.impl;

import clinic.dev.backend.model.VisitPayment;
import clinic.dev.backend.repository.VisitPaymentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VisitPaymentService {

  @Autowired
  private VisitPaymentRepo visitPaymentRepo;

  public VisitPayment create(VisitPayment visitPayment) {
    return visitPaymentRepo.save(visitPayment);
  }

  public VisitPayment update(Long id, VisitPayment updatedVisitPayment) {
    VisitPayment existingVisitPayment = getById(id);
    existingVisitPayment.setVisit(updatedVisitPayment.getVisit());
    existingVisitPayment.setPayment(updatedVisitPayment.getPayment());
    return visitPaymentRepo.save(existingVisitPayment);
  }

  public void delete(Long id) {
    visitPaymentRepo.deleteById(id);
  }

  public VisitPayment getById(Long id) {
    return visitPaymentRepo.findById(id).orElseThrow(() -> new RuntimeException("VisitPayment not found"));
  }

  public List<VisitPayment> getAll() {
    return visitPaymentRepo.findAll();
  }
}