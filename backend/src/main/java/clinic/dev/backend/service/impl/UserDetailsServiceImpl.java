package clinic.dev.backend.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import clinic.dev.backend.constants.ErrorMsg;
import clinic.dev.backend.model.User;
import clinic.dev.backend.repository.UserRepo;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

  @Autowired
  private UserRepo userRepo;

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    User user = userRepo.findByUsername(username);

    if (user == null) {
      throw new UsernameNotFoundException(ErrorMsg.USER_NOT_FOUND_WITH_USERNAME + username);
    }

    return user;
  }

}
