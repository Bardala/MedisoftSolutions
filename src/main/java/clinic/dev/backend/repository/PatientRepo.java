package clinic.dev.backend.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import clinic.dev.backend.model.Patient;

// public interface PatientRepo extends JpaRepository<Patient, Long> {

// }

public interface PatientRepo extends JpaRepository<Patient, Long>, JpaSpecificationExecutor<Patient> {
  boolean existsByFullName(String fullname);

  Optional<Patient> findByFullName(String string);

  List<Patient> findByPhoneContaining(String phone, Pageable pageable);

  List<Patient> findByFullNameContainingIgnoreCase(String name, Pageable pageable);

  List<Patient> findByClinicId(Long clinicId);

  List<Patient> findByClinicIdAndFullNameContainingIgnoreCase(Long clinicId, String name, Pageable pageable);

  List<Patient> findByClinicIdAndPhoneContaining(Long clinicId, String phone, Pageable pageable);

  void deleteAllByClinicId(Long clinicId);

  Optional<Patient> findByIdAndClinicId(Long id, Long clinicId);

  List<Patient> findByCreatedAtBetweenAndClinicId(LocalDateTime start, LocalDateTime end, Long clinicId);

  List<Patient> findAllByClinicId(Long clinicId);

  boolean existsByFullNameAndClinicId(String fullName, Long clinicId);

  boolean existsByIdAndClinicId(Long id, Long clinicId);

  void deleteByIdAndClinicId(Long id, Long clinicId);

  List<Patient> findByIdInAndClinicId(List<Long> ids, Long clinicId);
}