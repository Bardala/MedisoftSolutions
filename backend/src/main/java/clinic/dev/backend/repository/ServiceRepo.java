package clinic.dev.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import clinic.dev.backend.model.DentalProcedure;

public interface ServiceRepo extends JpaRepository<DentalProcedure, Long> {

}
