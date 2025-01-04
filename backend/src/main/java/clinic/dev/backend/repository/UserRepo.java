package clinic.dev.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import clinic.dev.backend.model.User;

public interface UserRepo extends JpaRepository<User, Long> {

}
