package clinic.dev.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import clinic.dev.backend.model.Medicine;

public interface MedicineRepo extends JpaRepository<Medicine, Long> {
  Optional<Medicine> findByMedicineName(String string);

  List<Medicine> findByClinicId(Long clinicId);

  Optional<Medicine> findByMedicineNameAndClinicId(String name, Long clinicId);

  boolean existsByMedicineNameAndClinicId(String medicineName, Long clinicId);

  Optional<Medicine> findByIdAndClinicId(Long id, Long clinicId);

  boolean existsByIdAndClinicId(Long id, Long clinicId);

  void deleteByIdAndClinicId(Long id, Long clinicId);

  List<Medicine> findAllByClinicId(Long clinicId);

  List<Medicine> findByMedicineNameContainingIgnoreCaseAndClinicId(String name, Long clinicId);

  List<Medicine> findByIdInAndClinicId(List<Long> ids, Long clinicId);
}
