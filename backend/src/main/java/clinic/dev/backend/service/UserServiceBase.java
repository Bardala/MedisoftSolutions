package clinic.dev.backend.service;

import java.util.List;

import clinic.dev.backend.dto.auth.SignupRequest;
import clinic.dev.backend.dto.user.UserReqDTO;
import clinic.dev.backend.dto.user.UserResDTO;

public interface UserServiceBase {
  UserResDTO signup(SignupRequest signupRequest);

  UserResDTO create(UserReqDTO req);

  UserResDTO getById(Long id);

  UserResDTO getByUsername(String username);

  UserResDTO getByPhone(String phone);

  List<UserResDTO> getAll();

  List<UserResDTO> getByRole(String role);

  UserResDTO update(Long id, UserReqDTO req) throws IllegalAccessException;

  void deleteById(Long id);

  void deleteByUsername(String username);

  void deleteByPhone(String phone);

  void deleteAll();

  // reset password
  void resetPassword(String newPassword);
}
