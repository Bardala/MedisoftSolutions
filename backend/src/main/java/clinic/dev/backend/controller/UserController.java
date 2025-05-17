package clinic.dev.backend.controller;

import clinic.dev.backend.dto.user.UserReqDTO;
import clinic.dev.backend.dto.user.UserResDTO;
import clinic.dev.backend.service.UserServiceBase;
import clinic.dev.backend.util.ApiRes;
import jakarta.validation.Valid;

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
  public ResponseEntity<ApiRes<List<UserResDTO>>> getAllUsers() {
    List<UserResDTO> users = userService.getAll();
    return ResponseEntity.ok(new ApiRes<List<UserResDTO>>(users));
  }

  @GetMapping("/{id}")
  public ResponseEntity<ApiRes<UserResDTO>> getUserById(@PathVariable("id") Long id) {
    UserResDTO user = userService.getById(id);
    return ResponseEntity.ok(new ApiRes<UserResDTO>(user));
  }

  @GetMapping("/username/{username}")
  public ResponseEntity<ApiRes<UserResDTO>> getUserByUsername(@PathVariable("username") String username) {
    UserResDTO user = userService.getByUsername(username);
    return ResponseEntity.ok(new ApiRes<>(user));
  }

  @GetMapping("/phone/{phone}")
  public ResponseEntity<ApiRes<UserResDTO>> getUserByPhone(@PathVariable("phone") String phone) {
    UserResDTO user = userService.getByPhone(phone);
    return ResponseEntity.ok(new ApiRes<>(user));
  }

  @GetMapping("/role/{role}")
  public ResponseEntity<ApiRes<List<UserResDTO>>> getUsersByRole(@PathVariable("role") String role) {
    List<UserResDTO> users = userService.getByRole(role);
    return new ResponseEntity<>(new ApiRes<>(users), HttpStatus.OK);
  }

  @PostMapping
  public ResponseEntity<ApiRes<UserResDTO>> create(@Valid @RequestBody UserReqDTO req) {
    UserResDTO user = userService.create(req);
    return ResponseEntity.ok(new ApiRes<>(user));
  }

  @PutMapping("/update/{id}")
  public ResponseEntity<ApiRes<UserResDTO>> updateUser(
      @PathVariable("id") Long id,
      @Valid @RequestBody UserReqDTO updatedUser) throws IllegalAccessException {
    UserResDTO user = userService.update(id, updatedUser);
    return ResponseEntity.ok(new ApiRes<>(user));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteUserById(@PathVariable("id") Long id) {
    userService.deleteById(id);
    return new ResponseEntity<>(HttpStatus.OK);
  }

  @DeleteMapping("/username/{username}")
  public ResponseEntity<Void> deleteUserByUsername(@PathVariable("username") String username) {
    userService.deleteByUsername(username);
    return new ResponseEntity<>(HttpStatus.OK);
  }

  @DeleteMapping("/phone/{phone}")
  public ResponseEntity<Void> deleteUserByPhone(@PathVariable("phone") String phone) {
    userService.deleteByPhone(phone);
    return new ResponseEntity<>(HttpStatus.OK);
  }

  @DeleteMapping("/all")
  public ResponseEntity<Void> deleteAllUsers() {
    userService.deleteAll();
    return new ResponseEntity<>(HttpStatus.OK);
  }

  @PutMapping("/reset-password")
  public ResponseEntity<Void> resetPassword(@RequestBody String newPassword) {
    userService.resetPassword(newPassword);
    return new ResponseEntity<>(HttpStatus.OK);
  }
}