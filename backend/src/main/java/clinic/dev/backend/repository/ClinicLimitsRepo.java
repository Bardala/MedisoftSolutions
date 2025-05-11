package clinic.dev.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import clinic.dev.backend.model.ClinicLimits;

@Repository
public interface ClinicLimitsRepo extends JpaRepository<ClinicLimits, Long> {

  void deleteByClinicId(Long id);

}
