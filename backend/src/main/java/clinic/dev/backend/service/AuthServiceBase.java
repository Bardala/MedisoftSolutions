package clinic.dev.backend.service;

import org.springframework.security.core.AuthenticationException;

import clinic.dev.backend.dto.auth.CurrUserInfo;

public interface AuthServiceBase {
  String login(String username, String password) throws AuthenticationException;

  CurrUserInfo getCurrUser(String token) throws AuthenticationException;
}