package clinic.dev.backend.dto.user;

import java.time.LocalDateTime;

import clinic.dev.backend.model.User;

public record UserResDTO(
    Long id,
    Long clinicId,
    String username,
    String name,
    String phone,
    String role,
    String profilePicture,
    LocalDateTime createdAt) {
  public static UserResDTO fromEntity(User user) {
    return new UserResDTO(user.getId(), user.getClinic().getId(), user.getUsername(), user.getName(), user.getPhone(),
        user.getRole(), user.getProfilePicture(), user.getCreatedAt());
  }
}
