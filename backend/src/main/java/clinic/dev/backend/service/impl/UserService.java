package clinic.dev.backend.service.impl;

import clinic.dev.backend.constants.ErrorMsg;
import clinic.dev.backend.dto.auth.SignupRequest;
import clinic.dev.backend.exceptions.UserNotFoundException;
import clinic.dev.backend.model.User;
import clinic.dev.backend.repository.UserRepo;
import clinic.dev.backend.service.UserServiceBase;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService implements UserServiceBase {

  @Autowired
  private UserRepo userRepo;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Override
  public User signup(SignupRequest request) {
    String username = request.getUsername(), password = request.getPassword(), role = request.getRole();

    if (userRepo.existsByUsername(username)) {
      throw new IllegalArgumentException(ErrorMsg.USERNAME_ALREADY_EXISTS);
    }

    if (userRepo.existsByPhone(request.getPhone())) {
      throw new IllegalArgumentException(ErrorMsg.PHONE_ALREADY_EXISTS);
    }

    User user = new User();
    user.setUsername(username);
    user.setPassword(passwordEncoder.encode(password));
    user.setRole(role);
    user.setPhone(request.getPhone());
    user.setName(request.getName());

    return userRepo.save(user);
  }

  @Override
  public User getById(Long id) {
    return userRepo.findById(id).orElseThrow(() -> new UserNotFoundException(ErrorMsg.USER_NOT_FOUND_WITH_ID));
  }

  @Override
  public User getByUsername(String username) {
    return userRepo.findByUsername(username)
        .orElseThrow(() -> new UserNotFoundException(ErrorMsg.USER_NOT_FOUND_WITH_USERNAME));
  }

  @Override
  public User getByPhone(String phone) {
    return userRepo.findByPhone(phone).orElseThrow(() -> new UserNotFoundException(ErrorMsg.USER_NOT_FOUND_WITH_PHONE));
  }

  @Override
  public List<User> getAll() {
    return userRepo.findAll();
  }

  @Override
  public List<User> getByRole(String role) {
    return userRepo.findByRole(role);
  }

  @Override
  public User update(User user) {
    user.setPassword(passwordEncoder.encode(user.getPassword()));
    return userRepo.save(user);
  }

  @Override
  public Boolean deleteById(Long id) {
    if (!userRepo.existsById(id)) {
      throw new UserNotFoundException(ErrorMsg.USER_NOT_FOUND_WITH_ID);
    }
    userRepo.deleteById(id);
    return true;
  }

  @Override
  @Transactional
  public Boolean deleteByUsername(String username) {
    if (!userRepo.existsByUsername(username)) {
      throw new UserNotFoundException(ErrorMsg.USER_NOT_FOUND_WITH_USERNAME);
    }
    userRepo.deleteUserByUsername(username);
    return true;
  }

  @Override
  @Transactional
  public Boolean deleteByPhone(String phone) {
    if (!userRepo.existsByPhone(phone)) {
      throw new UserNotFoundException(ErrorMsg.USER_NOT_FOUND_WITH_PHONE);
    }
    userRepo.deleteUserByPhone(phone);
    return true;
  }

  @Override
  public Boolean deleteAll() {
    userRepo.deleteAll();
    return true;
  }

  @Override
  public Boolean resetPassword(String username, String newPassword) {
    User user = userRepo.findByUsername(username)
        .orElseThrow(() -> new UserNotFoundException(ErrorMsg.USER_NOT_FOUND_WITH_USERNAME));
    user.setPassword(passwordEncoder.encode(newPassword));
    userRepo.save(user);
    return true;
  }
}
