package clinic.dev.backend.util;

import clinic.dev.backend.exceptions.UnauthorizedAccessException;
import clinic.dev.backend.repository.UserRepo;
import lombok.Data;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

@Component
@RequestScope
@Data
public class AuthContext {
  private Long clinicId;
  private Long userId;
  private String username;
  private String role; // This should be set during authentication

  private final UserRepo userRepository;

  public AuthContext(UserRepo userRepository) {
    this.userRepository = userRepository;
  }

  public boolean hasAdminAccessToClinic(Long clinicIdToCheck) {
    // First verify the user belongs to the clinic they're trying to access
    if (!clinicId.equals(clinicIdToCheck)) {
      return false;
    }

    // Then check if they have admin role
    return "Admin".equalsIgnoreCase(role);
  }

  public void validateAdminAccess() {
    if (!"Admin".equalsIgnoreCase(role))
      throw new UnauthorizedAccessException("Only Admin users can perform this action");
  }

  public void validateAdminOrDoctorAccess() {
    if ("Assistant".equalsIgnoreCase(role))
      throw new UnauthorizedAccessException("Assistant users can not perform this action");
  }

  // Optional: More granular role checks
  public boolean isDoctor() {
    return "Doctor".equalsIgnoreCase(role);
  }

  public boolean isAssistant() {
    return "Assistant".equalsIgnoreCase(role);
  }

  public boolean isAdmin() {
    return "Admin".equalsIgnoreCase(role);
  }
}
