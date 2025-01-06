// package clinic.dev.backend.util;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.core.Authentication;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.stereotype.Component;

// import clinic.dev.backend.model.User;
// import clinic.dev.backend.repository.UserRepo;

// @Component
// public class AuthUser {

// private String identifier;
// private User user;

// @Autowired
// private UserRepo userRepo;

// public String getIdentifier() {
// Authentication authentication =
// SecurityContextHolder.getContext().getAuthentication();
// if (authentication == null || !authentication.isAuthenticated()) {
// throw new IllegalStateException("No authenticated user found");
// }

// identifier = authentication.getName();
// return identifier;
// }

// public User getUser() {
// if (user == null) {
// user = userRepo.findByUsername(getIdentifier()).orElseThrow();
// }
// return user;
// }
// }
