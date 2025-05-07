package clinic.dev.backend.repository;

import clinic.dev.backend.model.ClinicSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClinicSettingsRepo extends JpaRepository<ClinicSettings, Long> {

  ClinicSettings findTopByOrderByIdDesc();
}
