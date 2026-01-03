package clinic.dev.backend.dto.user;

import clinic.dev.backend.constants.ErrorMsg;
import clinic.dev.backend.model.Clinic;
import clinic.dev.backend.model.User;
import clinic.dev.backend.model.enums.UserRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateUserReqDTO(
    // todo: remove username
    @NotBlank @Pattern(regexp = "^[\\S]+$", message = "Username must not contain spaces") @Size(min = 3, max = 20, message = "Username must be 3-20 characters") @Pattern(regexp = "^[a-zA-Z0-9._-]+$", message = "Only letters, numbers, dots, underscores and hyphens allowed") String username,

    String password,

    String lastPassword,

    @NotBlank(message = ErrorMsg.FULLNAME_IS_REQUIRED) String name,

    @NotBlank(message = ErrorMsg.PHONE_IS_REQUIRED) @Pattern(regexp = "^0\\d{9,14}$", message = "Phone must start with 0 and be 10-15 digits") String phone,

    @NotNull UserRole role,

    String profilePicture) {

  public User toEntity(Long clinicId) {
    return User.builder()
        .username(username)
        .password(password)
        .name(name)
        .phone(phone)
        .role(role)
        .profilePicture(profilePicture)
        .clinic(new Clinic(clinicId))
        .build();
  }

  public void updateEntity(User user, Long clinicId) {

    if (password != null && !password.isEmpty()) {
      user.setPassword(password);
    }
    user.setName(name);
    user.setPhone(phone);
    user.setRole(role);
    user.setProfilePicture(profilePicture);
    user.setClinic(new Clinic(clinicId));
  }

  public UpdateUserReqDTO withPassword(String encodedPassword) {
    return new UpdateUserReqDTO(username, encodedPassword, lastPassword, name, phone, role, profilePicture);
  }
}