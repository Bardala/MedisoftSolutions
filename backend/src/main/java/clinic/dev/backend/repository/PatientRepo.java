package clinic.dev.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import clinic.dev.backend.model.Patient;

public interface PatientRepo extends JpaRepository<Patient, Long> {

  boolean existsByFullName(String fullname);

  Optional<Patient> findByFullName(String string);
}
