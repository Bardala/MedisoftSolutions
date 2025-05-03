package clinic.dev.backend.repository;

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
}