package clinic.dev.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import clinic.dev.backend.model.Visit;

public interface VisitRepo extends JpaRepository<Visit, Long> {

  List<Visit> findByPatientId(Long id);

  void deleteByPatientId(Long id);

  List<Visit> findByClinicId(Long clinicId);

  List<Visit> findByClinicIdAndPatientId(Long clinicId, Long patientId);

  void deleteByPatientIdAndClinicId(Long id, Long clinicId);

  List<Visit> findByPatientIdAndClinicId(Long id, Long clinicId);

}
