package clinic.dev.backend.service.impl;

import clinic.dev.backend.constants.ErrorMsg;
import clinic.dev.backend.dto.SignupRequest;
import clinic.dev.backend.exceptions.UserNotFoundException;
import clinic.dev.backend.model.User;
import clinic.dev.backend.repository.UserRepo;
import clinic.dev.backend.service.UserServiceBase;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService implements UserServiceBase {

  @Autowired
  private UserRepo userRepo;

  @Autowired
  private PasswordEncoder passwordEncoder;

  public User signup(SignupRequest request) {
    String username = request.getUsername(), password = request.getPassword(), role = request.getRole();

    if (userRepo.existsByUsername(username)) {
      throw new IllegalArgumentException(ErrorMsg.USERNAME_ALREADY_EXISTS);
    }

    User user = new User();
    user.setUsername(request.getUsername());
    // * BCrypt automatically generates a random salt for each password
    user.setRole(role);
    user.setPassword(passwordEncoder.encode(password));

    return userRepo.save(user);
  }

  // ? You have to get ride of this method
  public User create(User user) {
    return userRepo.save(user);
  }

  @Override
  public User update(User user) {
    User existingUser = userRepo.findByUsername(user.getUsername());

    if (existingUser == null)
      throw new UserNotFoundException(ErrorMsg.USER_NOT_FOUND_WITH_USERNAME);

    existingUser.setUsername(user.getUsername());
    existingUser.setPassword(user.getPassword());
    existingUser.setRole(user.getRole());
    return userRepo.save(existingUser);
  }

  @Override
  public Boolean deleteById(Long id) {
    userRepo.deleteById(id);
    return true;
  }

  // @Override
  // public User getById(Long id) {
  // return userRepo.findById(id).orElseThrow(() -> new RuntimeException("User not
  // found"));
  // }

  public User getById(Long id) throws UserNotFoundException {
    Optional<User> optionalUser = userRepo.findById(id);

    if (!optionalUser.isPresent())
      throw new UserNotFoundException(ErrorMsg.USER_NOT_FOUND_WITH_ID);

    return optionalUser.get();
  }

  public User getByUsername(String username) {
    User user = userRepo.findByUsername(username);

    if (user == null)
      throw new UserNotFoundException(ErrorMsg.USER_NOT_FOUND_WITH_USERNAME);

    return user;
  }

  @Override
  public List<User> getAll() {
    return userRepo.findAll();
  }

  @Override
  public Boolean deleteByUsername(String username) {
    userRepo.deleteUserByUsername(username);
    return true;
  }
}
