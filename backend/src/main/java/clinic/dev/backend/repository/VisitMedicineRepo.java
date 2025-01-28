package clinic.dev.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import clinic.dev.backend.model.VisitMedicine;

public interface VisitMedicineRepo extends JpaRepository<VisitMedicine, Long> {

  List<VisitMedicine> findByVisitPatientId(Long id);

  List<VisitMedicine> findByVisitId(Long id);

  void deleteByVisitPatientId(Long patientId);

  void deleteByMedicineId(Long id);
}
