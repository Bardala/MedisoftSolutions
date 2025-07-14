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

  Optional<User> findByIdAndClinicId(Long id, Long clinicId);

  Optional<User> findByUsernameAndClinicId(String username, Long clinicId);

  Optional<User> findByPhoneAndClinicId(String phone, Long clinicId);

  List<User> findAllByClinicId(Long clinicId);

  List<User> findByRoleAndClinicId(String role, Long clinicId);

  void deleteByIdAndClinicId(Long id, Long clinicId);

  boolean existsByIdAndClinicId(Long id, Long clinicId);

  void deleteUserByUsernameAndClinicId(String username, Long clinicId);

  void deleteUserByPhoneAndClinicId(String phone, Long clinicId);

  boolean existsByPhoneAndClinicId(String phone, Long clinicId);

  boolean existsByUsernameAndClinicId(String username, Long clinicId);

  List<User> findByIdInAndClinicId(List<Long> ids, Long clinicId);

  Integer countUsersByClinicId(Long clinicId);
}
