package clinic.dev.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import clinic.dev.backend.model.User;

public interface UserRepo extends JpaRepository<User, Long> {
  Optional<User> findByUsername(String username);

  Optional<User> findByPhone(String phone);

  boolean existsByUsername(String username);

  boolean existsByPhone(String phone);

  @Transactional
  void deleteUserByUsername(String username);

  @Transactional
  void deleteUserByPhone(String phone);

  List<User> findByRole(String role);

  @Modifying
  @Query("DELETE FROM User u WHERE u.clinic.id = :clinicId")
  void deleteAllByClinicId(@Param("clinicId") Long clinicId);

  List<User> findByClinicId(Long clinicId);

  List<User> findByClinicIdAndRole(Long clinicId, String role);

}
