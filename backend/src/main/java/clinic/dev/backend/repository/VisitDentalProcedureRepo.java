package clinic.dev.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import clinic.dev.backend.model.VisitDentalProcedure;

public interface VisitDentalProcedureRepo extends JpaRepository<VisitDentalProcedure, Long> {
  List<VisitDentalProcedure> findByVisitId(Long visitId);

  List<VisitDentalProcedure> findByVisitPatientId(Long id);
}