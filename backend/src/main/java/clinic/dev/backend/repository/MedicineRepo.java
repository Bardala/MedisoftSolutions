package clinic.dev.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import clinic.dev.backend.model.Medicine;

public interface MedicineRepo extends JpaRepository<Medicine, Long> {

}
