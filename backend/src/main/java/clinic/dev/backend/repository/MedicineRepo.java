package clinic.dev.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import clinic.dev.backend.model.Medicine;

public interface MedicineRepo extends JpaRepository<Medicine, Long> {

  Optional<Medicine> findByMedicineName(String string);

}
