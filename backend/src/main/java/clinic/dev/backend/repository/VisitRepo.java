package clinic.dev.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import clinic.dev.backend.model.Visit;

public interface VisitRepo extends JpaRepository<Visit, Long> {

}
