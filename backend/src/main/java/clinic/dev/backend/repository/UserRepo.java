package clinic.dev.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import clinic.dev.backend.model.User;

public interface UserRepo extends JpaRepository<User, Long> {
  User findByUsername(String username);

  boolean existsByUsername(String username);

  boolean deleteUserByUsername(String username);
}
