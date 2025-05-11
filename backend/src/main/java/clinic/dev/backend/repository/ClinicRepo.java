package clinic.dev.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import clinic.dev.backend.model.Clinic;

@Repository
public interface ClinicRepo extends JpaRepository<Clinic, Long> {

}
