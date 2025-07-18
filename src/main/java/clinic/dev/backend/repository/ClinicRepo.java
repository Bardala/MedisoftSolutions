package clinic.dev.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import clinic.dev.backend.model.Clinic;

@Repository
public interface ClinicRepo extends JpaRepository<Clinic, Long> {
  Optional<Clinic> findByName(String name);

  List<Clinic> findByNameContaining(String namePart);

  List<Clinic> findByNameContainingIgnoreCase(String namePart);

  Page<Clinic> findByNameContainingIgnoreCase(String namePart, Pageable pageable);

  Page<Clinic> findByPhoneNumberContainingIgnoreCase(String namePart, Pageable pageable);

  Page<Clinic> findByEmailContainingIgnoreCase(String namePart, Pageable pageable);

  // Combined search method
  @Query("SELECT c FROM Clinic c WHERE " +
      "(:name IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
      "(:phone IS NULL OR LOWER(c.phoneNumber) LIKE LOWER(CONCAT('%', :phone, '%'))) AND " +
      "(:email IS NULL OR LOWER(c.email) LIKE LOWER(CONCAT('%', :email, '%')))")
  Page<Clinic> searchClinics(
      @Param("name") String name,
      @Param("phone") String phone,
      @Param("email") String email,
      Pageable pageable);
}
