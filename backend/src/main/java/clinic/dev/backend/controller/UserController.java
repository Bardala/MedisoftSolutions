package clinic.dev.backend.controller;

import clinic.dev.backend.dto.user.ResetPasswordRequest;
import clinic.dev.backend.model.User;
import clinic.dev.backend.service.UserServiceBase;
import clinic.dev.backend.util.ApiRes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

  @Autowired
  private UserServiceBase userService;

  @GetMapping("/health")
  public ResponseEntity<String> health() {
    return new ResponseEntity<>("User controller is healthy", HttpStatus.OK);
  }

  @GetMapping
  public ResponseEntity<List<User>> getAllUsers() {
    List<User> users = userService.getAll();
    return new ResponseEntity<>(users, HttpStatus.OK);
  }

  @GetMapping("/{id}")
  public ResponseEntity<User> getUserById(@PathVariable Long id) {
    User user = userService.getById(id);
    return new ResponseEntity<>(user, HttpStatus.OK);
  }

  @GetMapping("/username/{username}")
  public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
    User user = userService.getByUsername(username);
    return new ResponseEntity<>(user, HttpStatus.OK);
  }

  @GetMapping("/phone/{phone}")
  public ResponseEntity<User> getUserByPhone(@PathVariable String phone) {
    User user = userService.getByPhone(phone);
    return new ResponseEntity<>(user, HttpStatus.OK);
  }

  @GetMapping("/role/{role}")
  public ResponseEntity<List<User>> getUsersByRole(@PathVariable String role) {
    List<User> users = userService.getByRole(role);
    return new ResponseEntity<>(users, HttpStatus.OK);
  }

  @PutMapping("/update")
  public ResponseEntity<ApiRes<User>> updateUser(@RequestBody User updatedUser) {
    User user = userService.update(updatedUser);
    return ResponseEntity.ok(new ApiRes<User>(user));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteUserById(@PathVariable Long id) {
    userService.deleteById(id);
    return new ResponseEntity<>(HttpStatus.OK);
  }

  @DeleteMapping("/username/{username}")
  public ResponseEntity<Void> deleteUserByUsername(@PathVariable String username) {
    userService.deleteByUsername(username);
    return new ResponseEntity<>(HttpStatus.OK);
  }

  @DeleteMapping("/phone/{phone}")
  public ResponseEntity<Void> deleteUserByPhone(@PathVariable String phone) {
    userService.deleteByPhone(phone);
    return new ResponseEntity<>(HttpStatus.OK);
  }

  @DeleteMapping("/all")
  public ResponseEntity<Void> deleteAllUsers() {
    userService.deleteAll();
    return new ResponseEntity<>(HttpStatus.OK);
  }

  @PutMapping("/reset-password")
  public ResponseEntity<Void> resetPassword(@RequestBody ResetPasswordRequest request) {
    userService.resetPassword(request.getUsername(), request.getNewPassword());
    return new ResponseEntity<>(HttpStatus.OK);
  }
}