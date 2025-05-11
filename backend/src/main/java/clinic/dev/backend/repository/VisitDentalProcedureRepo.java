package clinic.dev.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import clinic.dev.backend.model.VisitDentalProcedure;

public interface VisitDentalProcedureRepo extends JpaRepository<VisitDentalProcedure, Long> {
  List<VisitDentalProcedure> findByVisitId(Long visitId);

  List<VisitDentalProcedure> findByVisitPatientId(Long id);

  void deleteByVisitPatientId(@Param("patientId") Long patientId);

  void deleteByDentalProcedureId(Long id);

  void deleteByVisitId(Long id);

  void deleteByVisitPatientIdAndClinicId(Long id, Long clinicId);

  List<VisitDentalProcedure> findByVisitPatientIdAndClinicId(Long id, Long clinicId);
}