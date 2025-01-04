package clinic.dev.backend.service.impl;

import clinic.dev.backend.model.User;
import clinic.dev.backend.repository.UserRepo;
import clinic.dev.backend.service.BaseService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService implements BaseService<User> {

  @Autowired
  private UserRepo userRepo;

  @Override
  public User create(User user) {
    return userRepo.save(user);
  }

  @Override
  public User update(Long id, User updatedUser) {
    User existingUser = getById(id);
    existingUser.setUsername(updatedUser.getUsername());
    existingUser.setEmail(updatedUser.getEmail());
    existingUser.setPassword(updatedUser.getPassword());
    existingUser.setRole(updatedUser.getRole());
    return userRepo.save(existingUser);
  }

  @Override
  public void delete(Long id) {
    userRepo.deleteById(id);
  }

  @Override
  public User getById(Long id) {
    return userRepo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
  }

  @Override
  public List<User> getAll() {
    return userRepo.findAll();
  }
}
