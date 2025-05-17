package clinic.dev.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import clinic.dev.backend.model.VisitMedicine;

public interface VisitMedicineRepo extends JpaRepository<VisitMedicine, Long> {

  List<VisitMedicine> findByVisitPatientId(Long id);

  List<VisitMedicine> findByVisitId(Long id);

  void deleteByVisitPatientId(Long patientId);

  void deleteByMedicineId(Long id);

  List<VisitMedicine> findByMedicineId(Long medicineId);

  void deleteByVisitPatientIdAndClinicId(Long id, Long clinicId);

  List<VisitMedicine> findByVisitPatientIdAndClinicId(Long id, Long clinicId);

  void deleteByMedicineIdAndClinicId(Long id, Long clinicId);

  List<VisitMedicine> findAllByClinicId(Long clinicId);

  Optional<VisitMedicine> findByIdAndClinicId(Long id, Long clinicId);

  void deleteByIdAndClinicId(Long id, Long clinicId);

  List<VisitMedicine> findByVisitIdAndClinicId(Long visitId, Long clinicId);

  List<VisitMedicine> findByMedicineIdAndClinicId(Long medicineId, Long clinicId);
}
