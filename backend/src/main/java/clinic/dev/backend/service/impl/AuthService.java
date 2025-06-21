package clinic.dev.backend.service.impl;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import clinic.dev.backend.constants.ErrorMsg;
import clinic.dev.backend.dto.auth.CurrUserInfo;
import clinic.dev.backend.exceptions.UnauthorizedException;
import clinic.dev.backend.exceptions.UserNotFoundException;
import clinic.dev.backend.model.User;
import clinic.dev.backend.repository.UserRepo;
import clinic.dev.backend.service.AuthServiceBase;
import clinic.dev.backend.util.JwtUtil;

@Service
public class AuthService implements AuthServiceBase {

  @Autowired
  private AuthenticationManager authenticationManager;

  @Autowired
  private UserDetailsServiceImpl userDetailsService;

  @Autowired
  private JwtUtil jwtUtil;

  @Autowired
  private UserRepo userRepo;

  @Override
  public String login(String username, String password) throws AuthenticationException {
    try {
      authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
      UserDetails user = userDetailsService.loadUserByUsername(username);

      User dbUser = userRepo.findByUsername(username)
          .orElseThrow(() -> new UnauthorizedException(ErrorMsg.INVALID_USERNAME_OR_PASSWORD));

      return jwtUtil.generateToken(user.getUsername(), dbUser.getId(), dbUser.getRole(), dbUser.getClinic().getId());
    } catch (UsernameNotFoundException ex) {
      throw new UnauthorizedException(ErrorMsg.INVALID_USERNAME_OR_PASSWORD);
    } catch (BadCredentialsException ex) {
      throw new UnauthorizedException(ErrorMsg.INVALID_USERNAME_OR_PASSWORD);
    } catch (AuthenticationException ex) {
      throw new UnauthorizedException(ErrorMsg.INVALID_USERNAME_OR_PASSWORD);
    }
  }

  @Override
  public CurrUserInfo getCurrUser(String token) throws AuthenticationException {
    String username = jwtUtil.extractUsername(token);
    Long clinicId = jwtUtil.extractClinicId(token);
    Optional<User> user = userRepo.findByUsername(username);

    if (!user.isPresent()) {
      throw new UserNotFoundException(ErrorMsg.USER_DOES_NOT_EXIST);
    }

    CurrUserInfo currUserInfo = new CurrUserInfo();
    currUserInfo.setId(user.get().getId());
    currUserInfo.setUsername(user.get().getUsername());
    currUserInfo.setRole(user.get().getRole());
    currUserInfo.setPhone(user.get().getPhone());
    currUserInfo.setName(user.get().getName());
    currUserInfo.setClinicId(clinicId);

    return currUserInfo;
  }
}