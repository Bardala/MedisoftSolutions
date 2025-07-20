package clinic.dev.backend.dto.user;

import java.time.Instant;

import clinic.dev.backend.model.User;
import clinic.dev.backend.model.User.UserRole;

public record UserResDTO(
    Long id,
    Long clinicId,
    String username,
    String name,
    String phone,
    UserRole role,
    String profilePicture,
    Instant createdAt) {
  public static UserResDTO fromEntity(User user) {
    return new UserResDTO(user.getId(), user.getClinic().getId(), user.getUsername(), user.getName(), user.getPhone(),
        user.getRole(), user.getProfilePicture(), user.getCreatedAt());
  }
}
