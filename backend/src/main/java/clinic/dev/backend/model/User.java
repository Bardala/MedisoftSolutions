package clinic.dev.backend.model;

import clinic.dev.backend.validation.RoleConstraint;
import clinic.dev.backend.validation.StrongPassword;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

@Entity
@Data
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank
  @Pattern(regexp = "^[\\S]+$", message = "Username must not contain spaces")
  @Column(unique = true)
  private String username;

  @Column(unique = true)
  @NotBlank(message = "Email is mandatory")
  private String email;

  @NotBlank
  @StrongPassword(message = "Use a strong password")
  private String password;

  @NotNull
  @RoleConstraint(message = "Invalid role. Allowed roles are 'Doctor' and 'Assistant'")
  private String role; // e.g., 'Doctor', 'Assistant'
}
