package clinic.dev.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import clinic.dev.backend.model.VisitPayment;

public interface VisitPaymentRepo extends JpaRepository<VisitPayment, Long> {
  List<VisitPayment> findByVisitId(Long visitId);

  List<VisitPayment> findByVisitPatientId(Long id);
}