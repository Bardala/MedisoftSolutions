package clinic.dev.backend.service;

import java.util.List;

import clinic.dev.backend.dto.SignupRequest;
import clinic.dev.backend.model.User;

public interface UserServiceBase {
  User signup(SignupRequest signupRequest);

  User getById(Long id);

  User getByUsername(String username);

  List<User> getAll();

  User update(User user);

  Boolean deleteById(Long id);

  Boolean deleteByUsername(String username);
}
