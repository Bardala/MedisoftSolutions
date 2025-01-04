package clinic.dev.backend.controller;

import clinic.dev.backend.model.User;
import clinic.dev.backend.service.impl.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

  @Autowired
  private UserService userService;

  // Create a new user
  @PostMapping
  public ResponseEntity<User> createUser(@RequestBody User user) {
    User createdUser = userService.create(user);
    return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
  }

  // Get a user by ID
  @GetMapping("/{id}")
  public ResponseEntity<User> getUserById(@PathVariable Long id) {
    User user = userService.getById(id);
    return new ResponseEntity<>(user, HttpStatus.OK);
  }

  // Get all users
  @GetMapping
  public ResponseEntity<List<User>> getAllUsers() {
    List<User> users = userService.getAll();
    return new ResponseEntity<>(users, HttpStatus.OK);
  }

  // Update an existing user
  @PutMapping("/{id}")
  public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
    User user = userService.update(id, updatedUser);
    return new ResponseEntity<>(user, HttpStatus.OK);
  }

  // Delete a user
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
    userService.delete(id);
    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
  }
}
