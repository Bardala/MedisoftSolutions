package clinic.dev.backend.controller;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import clinic.dev.backend.dto.auth.CurrUserInfo;
import clinic.dev.backend.dto.auth.LoginRequest;
import clinic.dev.backend.dto.auth.LoginResponse;
import clinic.dev.backend.dto.auth.SignupRequest;
import clinic.dev.backend.dto.auth.SignupResponse;
import clinic.dev.backend.service.AuthServiceBase;
import clinic.dev.backend.service.impl.UserService;
import clinic.dev.backend.util.ApiRes;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

  @Autowired
  private AuthServiceBase authService;

  @Autowired
  private UserService signupService;

  @PostMapping("/signup")
  public ResponseEntity<ApiRes<SignupResponse>> signup(@Valid @RequestBody SignupRequest request) {
    signupService.signup(request);
    String token = authService.login(request.getUsername(), request.getPassword());
    SignupResponse res = new SignupResponse(token, request.getUsername());
    return ResponseEntity.ok(new ApiRes<>(res));
  }

  @PostMapping("/login")
  public ResponseEntity<ApiRes<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
    String token = authService.login(request.getIdentifier(), request.getPassword());
    LoginResponse res = new LoginResponse(token, request.getIdentifier());
    return ResponseEntity.ok(new ApiRes<>(res));
  }

  @GetMapping("/userInfo")
  public ResponseEntity<ApiRes<CurrUserInfo>> getCurrUser(@RequestHeader("Authorization") String authorizationHeader) {
    String token = authorizationHeader.substring(7);
    CurrUserInfo currUser = authService.getCurrUser(token);
    return ResponseEntity.ok(new ApiRes<>(currUser));
  }

  // todo: Refresh endpoint
  // @PostMapping("/refresh")
  // public ResponseEntity<AuthResponse>
  // refreshToken(@CookieValue("refresh_token") String refreshToken) {
  // if (!jwtUtil.validateRefreshToken(refreshToken)) {
  // throw new InvalidTokenException("Invalid refresh token");
  // }

  // User user = userService.getUserFromRefreshToken(refreshToken);
  // String newAccessToken = jwtUtil.generateAccessToken(user);

  // return ResponseEntity.ok(new AuthResponse(newAccessToken, 3600));
  // }
}
