package clinic.dev.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import clinic.dev.backend.model.Procedure;

public interface DentalProcedureRepo extends JpaRepository<Procedure, Long> {

  Optional<Procedure> findByIdAndClinicId(Long id, Long clinicId);

  void deleteByIdAndClinicId(Long id, Long clinicId);

  List<Procedure> findAllByClinicId(Long clinicId);

  List<Procedure> findByIdInAndClinicId(List<Long> ids, Long clinicId);
}
