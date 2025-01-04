package clinic.dev.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import clinic.dev.backend.model.Log;

public interface LogRepo extends JpaRepository<Log, Long> {
}
