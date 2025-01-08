package clinic.dev.backend.controller;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import clinic.dev.backend.dto.CurrUserInfo;
import clinic.dev.backend.dto.LoginRequest;
import clinic.dev.backend.dto.LoginResponse;
import clinic.dev.backend.dto.SignupRequest;
import clinic.dev.backend.dto.SignupResponse;
import clinic.dev.backend.service.AuthServiceBase;
import clinic.dev.backend.service.impl.UserService;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

  @Autowired
  private AuthServiceBase authService;

  @Autowired
  private UserService signupService;

  @PostMapping("/signup")
  public ResponseEntity<SignupResponse> signup(@Valid @RequestBody SignupRequest request) {
    signupService.signup(request);
    String token = authService.login(request.getUsername(), request.getPassword());
    SignupResponse res = new SignupResponse(token, request.getUsername());
    return ResponseEntity.ok(res);
  }

  @PostMapping("/login")
  public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
    String token = authService.login(request.getIdentifier(), request.getPassword());
    LoginResponse res = new LoginResponse(token, request.getIdentifier());
    return ResponseEntity.ok(res);
  }

  @GetMapping("/userInfo")
  public ResponseEntity<CurrUserInfo> getCurrUser(@RequestHeader("Authorization") String authorizationHeader) {
    String token = authorizationHeader.substring(7);
    CurrUserInfo currUser = authService.getCurrUser(token);
    return ResponseEntity.ok(currUser);
  }
}
