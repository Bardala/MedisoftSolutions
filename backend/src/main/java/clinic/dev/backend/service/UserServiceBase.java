package clinic.dev.backend.service;

import java.util.List;

import clinic.dev.backend.dto.auth.SignupRequest;
import clinic.dev.backend.model.User;

public interface UserServiceBase {
  User signup(SignupRequest signupRequest);

  User getById(Long id);

  User getByUsername(String username);

  User getByPhone(String phone);

  List<User> getAll();

  List<User> getByRole(String role);

  User update(User user);

  Boolean deleteById(Long id);

  Boolean deleteByUsername(String username);

  Boolean deleteByPhone(String phone);

  Boolean deleteAll();

  // reset password
  Boolean resetPassword(String username, String newPassword);
}
