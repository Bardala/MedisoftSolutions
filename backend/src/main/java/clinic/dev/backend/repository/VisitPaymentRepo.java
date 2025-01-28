package clinic.dev.backend.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import clinic.dev.backend.model.Visit;
import clinic.dev.backend.model.VisitPayment;

public interface VisitPaymentRepo extends JpaRepository<VisitPayment, Long> {
  List<VisitPayment> findByVisitId(Long visitId);

  List<VisitPayment> findByVisitPatientId(Long id);

  Collection<VisitPayment> findByVisit(Visit visit);

  void deleteByVisitPatientId(Long patientId);

  void deleteByPaymentId(Long id);

  void deleteByVisitId(Long id);
}