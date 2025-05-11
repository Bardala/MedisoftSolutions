package clinic.dev.backend.dto.user;

import clinic.dev.backend.constants.ErrorMsg;
import clinic.dev.backend.model.Clinic;
import clinic.dev.backend.model.User;
import clinic.dev.backend.validation.RoleConstraint;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record UserReqDTO(
    @NotBlank @Pattern(regexp = "^[\\S]+$", message = "Username must not contain spaces") String username,
    @NotBlank(message = ErrorMsg.PASSWORD_IS_REQUIRED) String password,
    @NotBlank(message = ErrorMsg.FULLNAME_IS_REQUIRED) String name,
    @NotBlank(message = ErrorMsg.PHONE_IS_REQUIRED) @Pattern(regexp = "^0\\d{9,14}$", message = "Phone must start with 0 and be 10-15 digits") String phone,
    // e.g., 'Doctor', 'Assistant', 'Admin'
    @NotNull @RoleConstraint(message = "Invalid role. Allowed roles are 'Doctor' and 'Assistant'") String role,
    String profilePicture) {
  public User toEntity(Clinic clinic) {
    return new User(null, clinic, username, password, name, phone, role, profilePicture, null);
  }

  public void updateEntity(User user, Clinic clinic) {
    user.setUsername(this.username());
    user.setPassword(this.password());
    user.setName(this.name());
    user.setPhone(this.phone());
    user.setRole(this.role());
    user.setProfilePicture(this.profilePicture());
    user.setClinic(clinic);
  }
}
