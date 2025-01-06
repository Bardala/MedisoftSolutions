package clinic.dev.backend.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import clinic.dev.backend.constants.ErrorMsg;
import clinic.dev.backend.model.User;
import clinic.dev.backend.repository.UserRepo;

import java.util.Optional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

  @Autowired
  private UserRepo userRepo;

  @Override
  public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
    return loadUserByIdentifier(identifier);
  }

  public UserDetails loadUserByIdentifier(String identifier) throws UsernameNotFoundException {
    Optional<User> user = userRepo.findByUsername(identifier);

    if (!user.isPresent()) {
      try {
        user = userRepo.findByPhone(identifier);
      } catch (NumberFormatException e) {
        throw new UsernameNotFoundException(ErrorMsg.USER_DOES_NOT_EXIST);
      }
    }

    return user.orElseThrow(() -> new UsernameNotFoundException(ErrorMsg.USER_DOES_NOT_EXIST));
  }
}